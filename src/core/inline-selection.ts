import { TextNode } from "../nodes/text";
import { EventBusProtocol } from "./event-bus";
import { AbstractModule } from "./module";
import { GroupNode, TreeNode, surround } from "./tree";
import { findNearestParentTreeNode } from "./utils";

export const selectionChangedEvent = Symbol('selection_changed');

export interface InlineSelectionProtocol extends EventBusProtocol {
    selectionChanged: { type: typeof selectionChangedEvent };
}

export class InlineSelectionModule extends AbstractModule<InlineSelectionProtocol> {
    selection: globalThis.Selection | null = null;

    get isSomethingSelected(): boolean {
        return this.selection !== null && !this.selection.isCollapsed;
    }

    get firstRange(): Range | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return this.selection!.getRangeAt(0);
    }

    get startNode(): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentTreeNode(this.editor.state, this.firstRange!.startContainer as HTMLElement);
    }

    get endNode(): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentTreeNode(this.editor.state, this.firstRange!.endContainer as HTMLElement);
    }

    get asText(): string | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return this.firstRange!.toString();
    }

    get asTree(): GroupNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return null;
    }

    updateSelection(selection: globalThis.Selection | null) {
        if (!selection) {
            this.resetSelection();
            return;
        }

        this.selection = selection;
        this.emit('selectionChanged', { type: selectionChangedEvent });
    }

    resetSelection() {
        if (!this.selection) {
            return;
        }

        this.selection.collapseToStart();
        this.selection = null;
        this.emit('selectionChanged', { type: selectionChangedEvent });
    }

    surround(group: GroupNode) {
        if (!this.isSomethingSelected) {
            return;
        }

        const start = this.startNode as TextNode;
        const end = this.endNode as TextNode;

        if (!start.text || !end.text) {
            return;
        }

        this.editor.execute(editor => surround(editor.state, start, end, this.firstRange!.startOffset, this.firstRange!.endOffset, group));
    }
}
