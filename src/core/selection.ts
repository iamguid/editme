import { findNearestParentAttachedNode } from "../utils";
import { GroupNode, TreeNode, findNodesBetween } from "./tree";

export class Selection {
    node: Node | null = null;
    selection: globalThis.Selection | null = null;
    range: Range | null = null;

    get isSomethingSelected(): boolean {
        return this.node !== null
            && this.range !== null
            && this.range !== null
            && !this.range.collapsed;
    }

    get startNode(): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentAttachedNode(this.range!.startContainer as HTMLElement);
    }

    get endNode(): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentAttachedNode(this.range!.endContainer as HTMLElement);
    }

    surroundContents(root: TreeNode, group: GroupNode): void {
        console.log(findNodesBetween(root, this.startNode!, this.endNode!));
    }
}
