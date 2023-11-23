import { ReactiveController } from "lit";
import { EditmeElement } from "./em-editme";

export class StateController implements ReactiveController {
    constructor(private host: EditmeElement) {
        host.addController(this);
    }

    onStateChanged = () => {
        this.host.requestUpdate();
    }

    hostConnected(): void {
        this.host.editor.on('stateChanged', this.onStateChanged);
    }

    hostDisconnected(): void {
        this.host.editor.off('stateChanged', this.onStateChanged);
    }
}