import { ReactiveController, ReactiveControllerHost } from "lit";
import { Editor } from "../core/editor";
import { EditmeElement } from "./em-editme";

export interface BlockSelectionControllerHost extends ReactiveControllerHost {
    editor: Editor
}

export class InlineSelectionController implements ReactiveController {
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