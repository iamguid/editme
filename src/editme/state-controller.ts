import { ReactiveController } from "lit";
import { EditmeElement } from "./em-editme";

export class StateController implements ReactiveController {
    constructor(private host: EditmeElement) {
        host.addController(this);
    }

    onSomethingChanged = () => {
        this.host.requestUpdate();
    }

    hostConnected(): void {
        this.host.editor.on('stateChanged', this.onSomethingChanged);
        this.host.editor.blockSelection.on('selectionChanged', this.onSomethingChanged);
    }

    hostDisconnected(): void {
        this.host.editor.off('stateChanged', this.onSomethingChanged);
        this.host.editor.blockSelection.off('selectionChanged', this.onSomethingChanged);
    }
}