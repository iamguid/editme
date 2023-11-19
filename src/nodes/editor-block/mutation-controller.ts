import { ReactiveController } from "lit";
import { findNearestParentAttachedNode } from "../../utils";
import { TextNode } from "../text";
import { produceTraverse } from "../../core/tree";
import { EditorBlockElement } from "./editor-block";

export class MutationController implements ReactiveController {
    observer!: MutationObserver
    isFirstUpdate = true;

    constructor(private host: EditorBlockElement) {
        host.addController(this);
    }

    onMutation: MutationCallback = (mutations) => {
        for (const mutation of mutations) {
            switch (mutation.type) {
                case 'characterData': {
                    const node = findNearestParentAttachedNode(mutation.target as HTMLElement) as TextNode;

                    if (node.text) {
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
