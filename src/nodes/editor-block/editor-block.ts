import { LitElement, css, html } from 'lit';
import {consume} from '@lit/context';
import { customElement, query } from 'lit/decorators.js';
import { editorContext } from '../../editor-context';
import { Editor } from '../../core/editor';
import '../../em-bold-token';
import { literal } from 'lit/static-html.js';
import { GroupNode, TreeNode } from '../../core/tree';
import { ref, createRef, Ref } from 'lit/directives/ref.js';

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

    observer!: MutationObserver

    onMutation: MutationCallback = (mutations) => {
        for (const mutation of mutations) {
            switch (mutation.type) {
                case 'characterData':
                    console.log((mutation.target.parentNode! as any)['node'])
            }
        }
    }

    override firstUpdated() {
        this.observer = new MutationObserver(this.onMutation);
        this.observer.observe(this.editorRef.value!, { attributes: false, characterData: true, childList: true, subtree: true });
    }

    static override styles = css`
        div {
            display: block;
            width: 100%;
        }
    `;

    override render() {
        return html`
            <div contenteditable autocomplete="off" autofill="off" ${ref(this.editorRef)}>${Array.from(this.children)}</div>
            <em-inline-toolbar/>
        `;
    }

    protected createRenderRoot() {
        return this;
    }
}


