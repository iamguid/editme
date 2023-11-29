import { ReactiveController } from "lit";
import { EditorBlockElement } from "./em-editor-block";

export class PasteController implements ReactiveController {
    host: EditorBlockElement;

    constructor(host: EditorBlockElement) {
        (this.host = host).addController(this);
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
    }

    hostDisconnected() {
        this.host.removeEventListener('paste', this.onPaste);
    }
}