import { Command } from './command';
import { GroupNode, TreeNode } from './tree';

export interface IHistoryItem {
    state: GroupNode;
    command: Command;
}

export class History {
    private history: IHistoryItem[];
    private cursor = 0;

    constructor(history: IHistoryItem[] = []) {
        this.history = history;
    }

    get canUndo() {
        return this.cursor > 0;
    }

    get canRedo() {
        return this.cursor > 0 && this.cursor < this.history.length - 1;
    }

    get current() {
        return this.history[this.cursor];
    }

    push(state: GroupNode, command: Command) {
        this.history = this.history.slice(0, this.cursor + 1);
        this.history.push({ state, command });
        this.cursor = this.history.length - 1;
    }

    backward(): { prev: IHistoryItem, next: IHistoryItem } | null {
        if (!this.canUndo) {
            return null;
        }

        const prev = this.history[this.cursor];
        this.cursor--;
        const next = this.history[this.cursor];

        return { prev, next }
    }

    forward(): { prev: IHistoryItem, next: IHistoryItem } | null {
        if (!this.canRedo) {
            return null
        }

        const prev = this.history[this.cursor];
        this.cursor++;
        const next = this.history[this.cursor];

        return { prev, next }
    }
}
