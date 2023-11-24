import { LitElement } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { GroupNode } from '../core/tree';
import { testtree } from '../testtree';
import { html } from 'lit/static-html.js';
import '../inline-toolbar/em-inline-toolbar';
import { boldInlineTool } from '../nodes/bold';
import { StateController } from './state-controller';

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    eventsController = new StateController(this);

    constructor() {
        super();

        this.editor.registerInlineTool(boldInlineTool);
    }

    get rootNode(): GroupNode {
        return this.editor.state;
    }

    override render() {
        return html`
            <${this.rootNode.view} .node=${this.rootNode}/>
            <em-inline-toolbar/>
        `;
    }

    // Hack for force update on state change
    override shouldUpdate = () => true
}

declare global {
    interface HTMLElementTagNameMap {
        'em-editme': EditmeElement;
    }
}