import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";
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
        this.host.editor.selection.on('selectionChanged', this.onSelectionChanged);
    }

    hostDisconnected() {
        this.host.editor.selection.off('selectionChanged', this.onSelectionChanged);
    }
}