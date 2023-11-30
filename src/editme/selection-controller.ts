import { ReactiveController } from "lit";
import { EditmeElement } from "./em-editme";

export class SelectionController implements ReactiveController {
    host: EditmeElement;

    constructor(host: EditmeElement) {
        (this.host = host).addController(this);
    }

    onSelectionChange = () => {
        const selection = document.getSelection()!;
        this.host.editor.inlineSelection.updateSelection(selection)
    }

    hostConnected() {
        document.addEventListener("selectionchange", this.onSelectionChange);
    }

    hostDisconnected() {
        document.removeEventListener("selectionchange", this.onSelectionChange);
    }
}