import { ReactiveController } from "lit";
import { EditorBlockElement } from "./em-editor-block";

export class SelectionController implements ReactiveController {
    host: EditorBlockElement;
    root!: ShadowRoot;

    constructor(host: EditorBlockElement) {
        (this.host = host).addController(this);
    }

    onSelectionChange = () => {
        this.host.editor.inlineSelection.updateSelection(this.root)
    }

    hostConnected() {
        this.root = this.host.shadowRoot!;
        this.host.addEventListener('mouseup', this.onSelectionChange);
    }

    hostDisconnected() {
        this.host.removeEventListener('mouseup', this.onSelectionChange);
    }
}