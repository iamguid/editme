import { LitElement, css } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';

import { editorContext } from '../../editor-context';
import { Editor } from '../../core/editor';
import { GroupNode, TreeNode } from '../../core/tree';
import { randomUUID } from '../../core/utils';
import { Template } from '../../core/templates';
import { MutationController } from './mutation-controller';
import { SelectionController } from './selection-controller';

export interface EditorBlockNode extends GroupNode {
}

export const createEditorBlockNode = (children: TreeNode[] = []): EditorBlockNode => ({
    id: randomUUID(),
    type: 'group',
    view: 'editor-block',
    children
})

export const editorNodeBlockTemplate: Template<EditorBlockNode> = (node) => {
    return html`<em-editor-block .node=${node}/>`;
}

@customElement('em-editor-block')
export class EditorBlockElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    @property({ attribute: false })
    node!: EditorBlockNode;

    editorRef: Ref<HTMLDivElement> = createRef();

    mutationController = new MutationController(this);
    selectionController = new SelectionController(this);

    static override styles = css`
        div {
            display: block;
            width: 100%;
        }
    `;

    override render() {
        return html`
            <div contenteditable spellcheck autocomplete="off" autofill="off" ${ref(this.editorRef)}>
                ${this.node.children.map(child => this.editor.templates.render(child.view, child))}
            </div>
        `;
    }
}
