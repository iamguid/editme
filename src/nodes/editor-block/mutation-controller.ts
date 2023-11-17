import { ReactiveController, ReactiveControllerHost } from "lit";
import { Editor } from "../../core/editor";
import { Ref } from "lit/directives/ref";
import { findNearestParentAttachedNode } from "../../utils";
import { TextNode } from "../text";
import { produceTraverse } from "../../core/tree";

export class MutationController implements ReactiveController {
    observer!: MutationObserver
    isFirstUpdate = true;

    constructor(
        private host: ReactiveControllerHost,
        private editor: Editor,
        private editorElementRef: Ref<HTMLDivElement>
    ) {
        host.addController(this);
    }

    onMutation: MutationCallback = (mutations) => {
        for (const mutation of mutations) {
            switch (mutation.type) {
                case 'characterData': {
                    const node = findNearestParentAttachedNode(mutation.target as HTMLElement) as TextNode;

                    if (node.text) {
                        this.editor.execute(editor => {
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
            this.observer.observe(this.editorElementRef.value!, { attributes: false, characterData: true, childList: true, subtree: true });
        }
    }

    hostDisconnected() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
