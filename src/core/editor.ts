import { Command } from "./command";
import { History } from "./history";
import { RootNode, createRootNode } from "../nodes/root";
import { TreeNode } from "./tree";

export class Editor {
    static empty() {
        return new Editor(createRootNode(), new History());
    }

    static from(root: RootNode) {
        return new Editor(root, new History());
    }

    constructor(
        private _state: TreeNode,
        private _history: History,
    ) {}

    get state() {
        return this._state;
    }

    get history() {
        return this._history;
    }

    undo() {
        if (this._history.canUndo) {
            const { next } = this._history.backward()!;
            this._state = next.state;
        }
    }

    redo() {
        if (this._history.canRedo) {
            const { next } = this._history.forward()!;
            this._state = next.state;
        }
    }

    do(command: Command) {
        const next = command(this);
        this._history.push(next, command);
        this._state = next;
    }

    execute(command: Command) {
        const next = command(this);
        this._state = next;
    }
}
