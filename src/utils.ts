import { TreeNode } from "./core/tree";

export const findNearestParentAttachedNode = (element: HTMLElement): TreeNode | null => {
    let currentElement: HTMLElement | null = element;

    while (currentElement !== null) {
        const node = (currentElement as unknown as { node: TreeNode }).node;

        if (node !== undefined) {
            return node;
        }

        currentElement = currentElement.parentElement;
    }

    return null;
}