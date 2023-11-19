import { LitElement, ReactiveController } from "lit";
import { EditorBlockElement } from "./editor-block";

export class SelectionController implements ReactiveController {
    host: EditorBlockElement;
    root: Node;

    constructor(host: EditorBlockElement) {
        this.root = (host as LitElement).getRootNode()!;
        (this.host = host).addController(this);
    }

    onSelectionChange = () => {
        this.host.editor.selection.updateSelection(this.root)
    }

    hostConnected() {
        this.host.addEventListener('mouseup', this.onSelectionChange);
    }

    hostDisconnected() {
        this.host.removeEventListener('mouseup', this.onSelectionChange);
    }
}