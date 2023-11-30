import { ReactiveController } from "lit";
import { BlockSelectorElement } from "./em-block-selector";

export class UpdateController implements ReactiveController {
    constructor(private host: BlockSelectorElement) {
        host.addController(this);
    }

    onSomethingChanged = () => {
        this.host.requestUpdate();
    }

    hostConnected(): void {
        this.host.editor.on('stateChanged', this.onSomethingChanged);
        this.host.editor.blockSelection.on('selectionChanged', this.onSomethingChanged);
        this.host.editor.blockSelection.on('selectionRectChanged', this.onSomethingChanged);
    }

    hostDisconnected(): void {
        this.host.editor.off('stateChanged', this.onSomethingChanged);
        this.host.editor.blockSelection.off('selectionChanged', this.onSomethingChanged);
        this.host.editor.blockSelection.off('selectionRectChanged', this.onSomethingChanged);
    }
}