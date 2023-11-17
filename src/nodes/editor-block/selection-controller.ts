import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";
import { Editor } from "../../core/editor";

export class SelectionController implements ReactiveController {
    host: ReactiveControllerHost;
    root: Node;

    constructor(host: ReactiveControllerHost, private editor: Editor) {
        this.root = (host as LitElement).getRootNode()!;
        (this.host = host).addController(this);
    }

    onSelectionChange = () => {
        const root = this.editor.selection.node = this.root
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selection = this.editor.selection.selection = (root as any).getSelection() as globalThis.Selection;
        this.editor.selection.range = selection.getRangeAt(0);
        console.log(this.editor.selection);
    }

    hostConnected() {
        document.addEventListener('selectionchange', this.onSelectionChange);
    }

    hostDisconnected() {
        document.removeEventListener('selectionchange', this.onSelectionChange);
    }
}