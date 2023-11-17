import { LitElement, css, html } from 'lit';
import {consume} from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { editorContext } from '../../editor-context';
import { Editor } from '../../core/editor';
import { literal } from 'lit/static-html.js';
import { GroupNode, TreeNode } from '../../core/tree';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { MutationController } from './mutation-controller';
import { SelectionController } from './selection-controller';

export interface EditorBlockNode extends GroupNode {
}

export const createEditorBlockNode = (children: TreeNode[] = []): EditorBlockNode => ({
    id: crypto.randomUUID(),
    type: 'group',
    view: literal`em-editor-block`,
    children
})

@customElement('em-editor-block')
export class EditorBlockElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    editorRef: Ref<HTMLDivElement> = createRef();

    mutationController!: MutationController;
    selectionController!: SelectionController;

    override connectedCallback(): void {
        super.connectedCallback();
        
        this.mutationController = new MutationController(this, this.editor, this.editorRef);
        this.selectionController = new SelectionController(this, this.editor);
    }

    static override styles = css`
        div {
            display: block;
            width: 100%;
        }
    `;

    override render() {
        return html`
            <div contenteditable autocomplete="off" autofill="off" ${ref(this.editorRef)}>
                ${Array.from(this.children)}
            </div>
            <em-inline-toolbar/>
        `;
    }

    protected createRenderRoot() {
        return this;
    }
}


