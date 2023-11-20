import { Command } from "./command";
import { History } from "./history";
import { Selection } from "./selection";
import { RootNode, createRootNode } from "../nodes/root";
import { GroupNode } from "./tree";
import { EventBus, EventBusProtocol } from "./event-bus";
import { InlineTool } from "./inline-tool";

export const stateChangedEvent = Symbol('state_changed');

export interface EditorEventBusProtocol extends EventBusProtocol {
    stateChanged: { type: typeof stateChangedEvent, state: GroupNode };
}

export class Editor extends EventBus<EditorEventBusProtocol> {
    static empty() {
        return new Editor(createRootNode(), new Selection(), new History());
    }

    static from(root: RootNode) {
        return new Editor(root, new Selection(), new History());
    }

    inlineTools: InlineTool[] = [];

    constructor(
        private _state: GroupNode,
        private _selection: Selection,
        private _history: History,
    ) {
        super();
    }

    get state() {
        return this._state;
    }

    get selection() {
        return this._selection;
    }

    get history() {
        return this._history;
    }

    registerInlineTool(tool: InlineTool) {
        if (this.inlineTools.some(t => t.id === tool.id)) {
            throw new Error(`Inline tool with id ${tool.id} already registered`);
        }

        this.inlineTools.push(tool);
    }

    unregisterInlineTool(id: string) {
        if (this.inlineTools.some(t => t.id === id)) {
            throw new Error(`Inline tool with id ${id} not registered`);
        }

        this.inlineTools = this.inlineTools.filter(t => t.id !== id);
    }

    undo() {
        if (this._history.canUndo) {
            const { next } = this._history.backward()!;
            this._state = next.state;
            this.emit('stateChanged', { type: stateChangedEvent, state: next.state });
        }
    }

    redo() {
        if (this._history.canRedo) {
            const { next } = this._history.forward()!;
            this._state = next.state;
            this.emit('stateChanged', { type: stateChangedEvent, state: next.state });
        }
    }

    do(command: Command) {
        const next = command(this);
        this._history.push(next, command);
        this._state = next;
        this.emit('stateChanged', { type: stateChangedEvent, state: next });
    }

    execute(command: Command) {
        const next = command(this);
        this._state = next;
        this.emit('stateChanged', { type: stateChangedEvent, state: next });
    }
}
