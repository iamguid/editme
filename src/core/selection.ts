import { TextNode } from "../nodes/text";
import { EventBusProtocol } from "./event-bus";
import { AbstractModule } from "./module";
import { GroupNode, TreeNode, surround } from "./tree";
import { findNearestParentTreeNode } from "./utils";

export const selectionChangedEvent = Symbol('selection_changed');

export interface SelectionProtocol extends EventBusProtocol {
    selectionChanged: { type: typeof selectionChangedEvent };
}

export class SelectionModule extends AbstractModule<SelectionProtocol> {
    domNode: globalThis.Node | null = null;
    editmeNode: TreeNode | null = null;
    selection: globalThis.Selection | null = null;
    range: globalThis.Range | null = null;

    get isSomethingSelected(): boolean {
        return this.domNode !== null
            && this.range !== null
            && this.selection !== null
            && !this.range.collapsed;
    }

    get startNode(): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentTreeNode(this.editor.state, this.range!.startContainer as HTMLElement);
    }

    get endNode(): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentTreeNode(this.editor.state, this.range!.endContainer as HTMLElement);
    }

    updateSelection(node: Node) {
        this.domNode = node;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selection = this.selection = (node as any).getSelection() as globalThis.Selection;
        this.range = selection.getRangeAt(0);
        this.emit('selectionChanged', { type: selectionChangedEvent });
    }

    surround(group: GroupNode) {
        if (!this.isSomethingSelected) {
            return;
        }

        const start = this.startNode as TextNode;
        const end = this.editmeNode as TextNode;

        if (!start.text || !end.text) {
            return;
        }

        this.editor.execute(editor => surround(editor.state, start, end, this.range!.startOffset, this.range!.endOffset, group));
    }
}
