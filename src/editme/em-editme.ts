import { LitElement, TemplateResult } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { GroupNode, TokenNode, TreeNode } from '../core/tree';
import { testtree } from '../testtree';
import { html } from 'lit/static-html.js';
import '../inline-toolbar/em-inline-toolbar';
import { boldInlineTool } from '../nodes/bold';
import { StateController } from './state-controller';

const renderNode = (node: TreeNode): TemplateResult => {
    switch (node.type) {
        case 'group': return renderGroup(node)
        case 'token': return renderToken(node)
    }
}

const renderGroup = (node: GroupNode): TemplateResult => {
    return html`
        <${node.view} .node=${node}>
            ${node.children.map(child => renderNode(child))}
        </${node.view}>
    `
}

const renderToken = (node: TokenNode): TemplateResult => {
    return html`<${node.view} .node=${node}/>`
}

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    eventsController = new StateController(this);

    constructor() {
        super();

        this.editor.registerInlineTool(boldInlineTool);
    }

    override render() {
        return html`
            ${renderNode(this.editor.state)}
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