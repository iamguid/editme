import { createLinkNode } from "../nodes/link";
import { TextNode } from "../nodes/text";
import { findNearestParentAttachedNode } from "../utils";
import { GroupNode, TreeNode, calculateIndexMap, deepCopyNode, copyNode, deleteById, findPathToNode, insertAfter, produceTraverse, insertBefore } from "./tree";

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

    surroundContents(root: GroupNode, group: GroupNode): TreeNode {
        const start = (this.startNode as TextNode);
        const end = (this.endNode as TextNode);

        if (!start.text) {
            throw new Error('startNode is not a TextNode');
        }

        if (!end.text) {
            throw new Error('endNode is not a TextNode');
        }

        const startPath = findPathToNode(root, start.id);
        const endPath = findPathToNode(root, end.id);

        let commonParentIndex = 0;
        while (
            commonParentIndex + 1 < startPath.length
            && commonParentIndex + 1 < endPath.length
            && startPath[commonParentIndex + 1] === endPath[commonParentIndex + 1]
        ) {
            commonParentIndex++;
        }

        const commonParent = startPath[commonParentIndex] as GroupNode;

        const { result: leftSliceResult, newNode: leftSliceNewNode } = this.sliceTextNode(
            root,
            commonParent,
            start,
            this.range!.startOffset,
            'right'
        );

        const { result: rightSliceResult, newNode: rightSliceNewNode } = this.sliceTextNode(
            leftSliceResult,
            commonParent,
            end,
            this.range!.endOffset,
            'left'
        );

        return produceTraverse(rightSliceResult, draft => {
            if (draft.id === commonParent.id) {

                let startPrevIndex = 0;
                let startIndex = 0;
                let endIndex = 0;
                let i = 0;

                while (i < (draft as GroupNode).children.length) {
                    if ((draft as GroupNode).children[i].id === leftSliceNewNode!.id) {
                        startPrevIndex = i - 1

                        if (startPrevIndex < 0) {
                            startPrevIndex = 0;
                        }

                        startIndex = i;
                    }

                    if ((draft as GroupNode).children[i].id === rightSliceNewNode!.id) {
                        endIndex = i;
                    }

                    i++;
                }

                const toWrap = (draft as GroupNode).children.splice(startIndex, endIndex - startIndex + 1);

                group.children.push(...toWrap);

                (draft as GroupNode).children.splice(startPrevIndex, 0, group);

                return true;
            }

            return false;
        })
    }

    sliceTextNode(root: GroupNode, sliceNode: GroupNode, textNode: TextNode, offset: number, mode: 'left' | 'right'): { result: GroupNode, newNode: TreeNode | null } {
        let newNode = null;

        const result = produceTraverse(root, draft => {
            if (draft.id === sliceNode.id) {
                const path = findPathToNode(draft, textNode.id);

                // Remove slieceNode from path
                path.shift();

                // Save sliceNode subling
                const sliceNodeSubling = path[0];

                let current: TreeNode = path.pop()!;
                let treeCopy = copyNode(current);
                let parent = path[path.length - 1] as GroupNode;

                if (mode === 'left') {
                    (treeCopy as TextNode).text = (current as TextNode).text.substring(0, offset);
                    (current as TextNode).text = (current as TextNode).text.substring(offset);
                }

                if (mode === 'right') {
                    (treeCopy as TextNode).text = (current as TextNode).text.substring(offset);
                    (current as TextNode).text = (current as TextNode).text.substring(0, offset);
                }

                while (path.length > 0) {
                    const childIndex = parent.children.findIndex(child => child.id === current.id);
                    const newParentCopy = copyNode(parent) as GroupNode;

                    if (mode === 'left') {
                        for (let i = 0; i < childIndex; i++) {
                            newParentCopy.children.push(deepCopyNode(parent.children[i]));
                        }

                        newParentCopy.children.push(treeCopy)

                        parent.children.splice(0, childIndex)
                    }

                    if (mode === 'right') {
                        newParentCopy.children.push(treeCopy)

                        for (let i = childIndex + 1; i < parent.children.length ; i++) {
                            newParentCopy.children.push(deepCopyNode(parent.children[i]));
                        }

                        parent.children.splice(childIndex + 1)
                    }

                    treeCopy = newParentCopy;
                    current = path.pop()!;
                    parent = path[path.length - 1] as GroupNode;
                }

                if (mode === 'left') {
                    (draft as GroupNode).children = insertBefore(draft as GroupNode, sliceNodeSubling.id, treeCopy!).children;
                }

                if (mode === 'right') {
                    (draft as GroupNode).children = insertAfter(draft as GroupNode, sliceNodeSubling.id, treeCopy!).children;
                }

                newNode = treeCopy;

                return true;
            }

            return false;
        })

        return { result, newNode }
    }
}
