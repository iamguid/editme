import { LitElement, ReactiveController } from "lit";
import { EditorBlockElement } from "./editor-block";

export class SelectionController implements ReactiveController {
    host: EditorBlockElement;
    root!: ShadowRoot;

    constructor(host: EditorBlockElement) {
        (this.host = host).addController(this);
    }

    onSelectionChange = () => {
        this.host.editor.selection.updateSelection(this.root)
    }

    hostConnected() {
        this.root = this.host.shadowRoot!;
        this.host.addEventListener('mouseup', this.onSelectionChange);
    }

    hostDisconnected() {
        this.host.removeEventListener('mouseup', this.onSelectionChange);
    }
}