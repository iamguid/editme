import { ReactiveController } from "lit";
import { TextNode } from "../nodes/text";
import { produceTraverse } from "../core/tree";
import { EditorBlockElement } from "./em-editor-block";
import { findNearestParentTreeNode } from "../core/utils";

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
                    const parent = findNearestParentTreeNode(this.host.editor.state, mutation.target as HTMLElement) as TextNode;

                    if (parent && typeof parent.text === 'string') {
                        this.host.editor.execute(editor => {
                            return produceTraverse(editor.state, draft => {
                                if (draft.id === parent.id) {
                                    (draft as TextNode).text = mutation.target.textContent!;
                                    return true;
                                }

                                return false;
                            });
                        });
                    } else {
                        throw new Error(`Node ${parent.id} should be TextNode`)
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
