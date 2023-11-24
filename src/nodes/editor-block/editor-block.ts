import { css } from 'lit';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { literal, html } from 'lit/static-html.js';

import { editorContext } from '../../editor-context';
import { Editor } from '../../core/editor';
import { GroupNode, TreeNode } from '../../core/tree';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { MutationController } from './mutation-controller';
import { SelectionController } from './selection-controller';
import { randomUUID } from '../../core/utils';
import { GroupNodeLitElement } from '../../node-element';

export interface EditorBlockNode extends GroupNode {
}

export const createEditorBlockNode = (children: TreeNode[] = []): EditorBlockNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-editor-block`,
    children
})

@customElement('em-editor-block')
export class EditorBlockElement extends GroupNodeLitElement<EditorBlockNode> {
    @consume({context: editorContext})
    editor!: Editor;

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
                ${this.renderChildren()}
            </div>
        `;
    }
}
