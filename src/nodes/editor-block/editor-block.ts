import { LitElement, css, html } from 'lit';
import {consume} from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { editorContext } from '../../editor-context';
import { Editor } from '../../core/editor';
import { literal } from 'lit/static-html.js';
import { GroupNode, TreeNode, produceTraverse } from '../../core/tree';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { findNearestParentAttachedNode } from '../../utils';
import { TextNode } from '../text';

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
                case 'characterData': {
                    const node = findNearestParentAttachedNode(mutation.target as HTMLElement) as TextNode;

                    if (node.text) {
                        this.editor.do(editor => {
                            return produceTraverse(editor.state, draft => {
                                if (draft.id === node.id) {
                                    (draft as TextNode).text = mutation.target.textContent!;
                                    return true;
                                }

                                return false;
                            });
                        });

                        console.log(this.editor.state)
                    } else {
                        throw new Error(`Node ${node.id} should be TextNode`)
                    }
                }
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


