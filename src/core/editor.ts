import { RootNode, createRootNode, rootNodeTemplate } from "../nodes/root";
import { GroupNode } from "./tree";
import { EventBus, EventBusProtocol } from "./event-bus";
import { InlineTool } from "./inline-tool";
import { AbstractModule } from "./module";
import { InlineSelectionModule } from "./inline-selection";
import { TemplatesModule } from "./templates";
import { HistoryModule } from "./history";
import { headerNodeTemplate } from "../nodes/header";
import { paragraphNodeTemplate } from "../nodes/paragraph";
import { textNodeTemplate } from "../nodes/text";
import { boldInlineTool, boldNodeTemplate } from "../nodes/bold";
import { italicNodeTemplate } from "../nodes/italic";
import { BlockSelectionModule } from "./block-selection";
import { columnsNodeTemplate } from "../nodes/columns";
import { containerNodeTemplate } from "../nodes/container";

export type Command = (editor: Editor) => GroupNode

export const stateChangedEvent = Symbol('state_changed');

export interface EditorProtocol extends EventBusProtocol {
    stateChanged: { type: typeof stateChangedEvent, state: GroupNode };
}

export class Editor extends EventBus<EditorProtocol> {
    static empty() {
        return new Editor(createRootNode());
    }

    static from(root: RootNode) {
        return new Editor(root);
    }

    modules: AbstractModule<EventBusProtocol>[] = [];
    tools: InlineTool[] = [];

    constructor(private _state: RootNode) {
        super();

        // Register core modules
        this.registerModule(TemplatesModule);
        this.registerModule(InlineSelectionModule);
        this.registerModule(BlockSelectionModule);
        this.registerModule(HistoryModule);

        // Register core templates
        this.templates.register('root-node', rootNodeTemplate);
        this.templates.register('header-node', headerNodeTemplate);
        this.templates.register('columns-node', columnsNodeTemplate);
        this.templates.register('container-node', containerNodeTemplate);
        this.templates.register('paragraph-node', paragraphNodeTemplate);
        this.templates.register('text-node', textNodeTemplate);
        this.templates.register('bold-node', boldNodeTemplate);
        this.templates.register('italic-node', italicNodeTemplate);

        // Register core inline tools
        this.registerTool(boldInlineTool);
    }

    set state(value: RootNode) {
        this._state = value;
        this.emit('stateChanged', { type: stateChangedEvent, state: value });
    }

    get state() {
        return this._state;
    }

    get inlineSelection() {
        return this.resolveModule(InlineSelectionModule);
    }

    get blockSelection() {
        return this.resolveModule(BlockSelectionModule);
    }

    get templates() {
        return this.resolveModule(TemplatesModule);
    }

    get history() {
        return this.resolveModule(HistoryModule);
    }

    registerTool(tool: InlineTool) {
        if (this.tools.some(t => t.id === tool.id)) {
            throw new Error(`Inline tool with id ${tool.id} already registered`);
        }

        this.tools.push(tool);
    }

    unregisterTool(id: string) {
        if (this.tools.some(t => t.id === id)) {
            throw new Error(`Inline tool with id ${id} not registered`);
        }

        this.tools = this.tools.filter(t => t.id !== id);
    }

    registerModule(ctor: new (...args: never[]) => AbstractModule<EventBusProtocol>) {
        const module = this.modules.find(m => m instanceof ctor);

        if (module) {
            throw new Error(`Module ${ctor.name} already registered`);
        }

        const instance = new ctor(this as never);
        this.modules.push(instance);

        return instance;
    }

    resolveModule<T>(ctor: new (...args: never[]) => T): T {
        const module = this.modules.find(m => m instanceof ctor);

        if (!module) {
            throw new Error(`Module ${ctor.name} not found`);
        }

        return module as T;
    }

    execute(command: Command) {
        const next = command(this);
        
        let processedState = next;
        for (const module of this.modules) {
            processedState = module.processState(processedState);
        }

        this.state = processedState;
    }
}
