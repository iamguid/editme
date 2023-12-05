import { ReactiveController } from "lit";
import { EditorBlockElement } from "./em-editor-block";

export class ClipboardController implements ReactiveController {
    host: EditorBlockElement;

    constructor(host: EditorBlockElement) {
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
        e.preventDefault();

        let paste = e.clipboardData?.getData("text/html") ?? '';
        paste = paste.toUpperCase();
        const selection = this.host.editor.inlineSelection.selection;
        if (!selection || !selection.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(paste));
        selection.collapseToEnd();
    }

    hostConnected() {
        this.host.addEventListener('paste', this.onPaste);
        this.host.addEventListener('copy', this.onCopy);
    }

    hostDisconnected() {
        this.host.removeEventListener('paste', this.onPaste);
        this.host.removeEventListener('copy', this.onCopy);
    }
}