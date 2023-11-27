import { ReactiveController } from "lit";
import { findNearestParentTreeNode } from "../../utils";
import { TextNode } from "../text";
import { deleteById, produceTraverse } from "../../core/tree";
import { EditorBlockElement } from "./editor-block";

export class MutationController implements ReactiveController {
    observer!: MutationObserver
    isFirstUpdate = true;
    ignoreMutationsCount = 0;

    constructor(private host: EditorBlockElement) {
        host.addController(this);
    }

    ignoreNextMutation(count = 1) {
        this.ignoreMutationsCount = count;
    }

    onMutation: MutationCallback = (mutations) => {
        if (this.ignoreMutationsCount > 0) {
            this.ignoreMutationsCount--;
            return;
        }

        for (const mutation of mutations) {
            switch (mutation.type) {
                case 'characterData': {
                    const node = findNearestParentTreeNode(this.host.editor.state, mutation.target as HTMLElement) as TextNode;

                    if (node && typeof node.text === 'string') {
                        this.host.editor.execute(editor => {
                            return produceTraverse(editor.state, draft => {
                                if (draft.id === node.id) {
                                    (draft as TextNode).text = mutation.target.textContent!;
                                    return true;
                                }

                                return false;
                            });
                        });
                    } else {
                        throw new Error(`Node ${node.id} should be TextNode`)
                    }
                    break;
                }
                case 'childList': {
                    for (const nodeToRemove of mutation.removedNodes) {
                        const id = ((nodeToRemove as HTMLElement)?.id)

                        if (typeof id === 'string') {
                            this.host.editor.do(editor => deleteById(editor.state, id))
                        }
                    }
                    break;
                }
            }
        }
    }

    hostUpdated() {
        if (this.isFirstUpdate) {
            this.isFirstUpdate = false;

            this.observer = new MutationObserver(this.onMutation);
            this.observer.observe(this.host.editorRef.value!, { attributes: false, characterData: true, childList: true, subtree: true });
        }
    }

    hostDisconnected() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
