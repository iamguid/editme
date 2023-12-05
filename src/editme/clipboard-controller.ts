import { ReactiveController, ReactiveControllerHost } from "lit";
import { Editor } from "../core/editor";

export interface ClipboardControllerHost extends ReactiveControllerHost {
    editor: Editor
}

export class ClipboardController implements ReactiveController {
    host: ClipboardControllerHost;

    constructor(host: ClipboardControllerHost) {
        (this.host = host).addController(this);
    }

    get blockSelection() {
        return this.host.editor.blockSelection
    }

    get inlineSelection() {
        return this.host.editor.inlineSelection
    }

    onCopy = (e: ClipboardEvent) => {
        if (this.inlineSelection.isSomethingSelected) {
            e.clipboardData?.setData("text/plain", this.inlineSelection.asText ?? '');
        }

        if (this.blockSelection.isSomethingSelected) {
            e.clipboardData?.setData("text/plain", this.blockSelection.asText ?? '');
        }

        e.preventDefault();
    }

    onPaste = (e: ClipboardEvent) => {
    }

    hostConnected() {
        document.addEventListener('paste', this.onPaste);
        document.addEventListener('copy', this.onCopy);
    }

    hostDisconnected() {
        document.removeEventListener('paste', this.onPaste);
        document.removeEventListener('copy', this.onCopy);
    }
}