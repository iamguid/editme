import { ReactiveController } from "lit";
import { InlineToolbarElement } from "./em-inline-toolbar";

export class SelectionController implements ReactiveController {
    host: InlineToolbarElement;

    constructor(host: InlineToolbarElement) {
        (this.host = host).addController(this);
    }

    onSelectionChanged = () => {
        this.host.requestUpdate();
    }

    hostConnected() {
        this.host.editor.inlineSelection.on('selectionChanged', this.onSelectionChanged);
    }

    hostDisconnected() {
        this.host.editor.inlineSelection.off('selectionChanged', this.onSelectionChanged);
    }
}