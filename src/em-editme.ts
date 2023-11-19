import { LitElement, TemplateResult } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { editorContext } from './editor-context';
import { Editor } from './core/editor';
import { GroupNode, TokenNode, TreeNode } from './core/tree';
import { testtree } from './testtree';
import { html } from 'lit/static-html.js';
import './em-inline-toolbar';
import { SelectionController } from './nodes/editor-block/selection-controller';

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

    override connectedCallback(): void {
        super.connectedCallback();
    }

    override render() {
        return html`
            ${renderNode(this.editor.state)}
            <em-inline-toolbar .selection=${this.editor.selection}/>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-editme': EditmeElement;
    }
}