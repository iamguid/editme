import { ReactiveController, ReactiveControllerHost } from "lit";
import { EditmeElement } from "./em-editme";
import { Editor } from "../core/editor";

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