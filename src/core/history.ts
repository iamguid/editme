import { Editor } from './editor';
import { EventBusProtocol } from './event-bus';
import { AbstractModule } from './module';
import { GroupNode, TreeNode } from './tree';

export const historyChangedEvent = Symbol('history_changed');
export const historyUndoEvent = Symbol('history_undo');
export const historyRedoEvent = Symbol('history_redo');

export interface HistoryProtocol extends EventBusProtocol {
    historyChanged: { type: typeof historyChangedEvent, history: GroupNode[] };
    historyUndo: { type: typeof historyUndoEvent, nextState: GroupNode };
    historyRedo: { type: typeof historyRedoEvent, nextState: GroupNode };
}

export class HistoryModule extends AbstractModule<HistoryProtocol> {
    private _history: GroupNode[] = [];
    private _cursor = 0;

    set history(value: GroupNode[]) {
        this._history = value;
        this.emit('historyChanged', { type: historyChangedEvent, history: this._history });
    }

    get history() {
        return this._history;
    }

    get canUndo() {
        return this._cursor > 0;
    }

    get canRedo() {
        return this._cursor > 0 && this._cursor < this._history.length - 1;
    }

    get current() {
        return this._history[this._cursor];
    }

    push(state: GroupNode) {
        this._history = this._history.slice(0, this._cursor + 1);
        this._history.push(state);
        this._cursor = this._history.length - 1;
    }

    undo() {
        if (this.canUndo) {
            const { next } = this.backward()!;
            this.editor.state = next;
            this.emit('historyUndo', { type: historyUndoEvent, nextState: next });
        }
    }

    redo() {
        if (this.canRedo) {
            const { next } = this.forward()!;
            this.editor.state = next;
            this.emit('historyRedo', { type: historyRedoEvent, nextState: next });
        }
    }

    override processState(state: GroupNode): GroupNode {
        this.push(state);
        return state;
    }

    private backward(): { prev: GroupNode, next: GroupNode } | null {
        if (!this.canUndo) {
            return null;
        }

        const prev = this._history[this._cursor];
        this._cursor--;
        const next = this._history[this._cursor];

        return { prev, next }
    }

    private forward(): { prev: GroupNode, next: GroupNode } | null {
        if (!this.canRedo) {
            return null
        }

        const prev = this._history[this._cursor];
        this._cursor++;
        const next = this._history[this._cursor];

        return { prev, next }
    }
}
