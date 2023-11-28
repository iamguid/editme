import { EventBusProtocol } from "./event-bus";
import { AbstractModule } from "./module";

export const selectionChangedEvent = Symbol('selection_changed');

export interface BlockSelectionProtocol extends EventBusProtocol {
    selectionChanged: { type: typeof selectionChangedEvent };
}

export class BlockSelectionModule extends AbstractModule<BlockSelectionProtocol> {
    private _selectedNodes: Set<string> = new Set();

    set selectedNodes(value: Set<string>) {
        this._selectedNodes = value;
        this.emit('selectionChanged', { type: selectionChangedEvent });
    }

    get selectedNodes() {
        return this._selectedNodes;
    }

    isNodeSelected(id: string) {
        return this.selectedNodes.has(id);
    }
}
