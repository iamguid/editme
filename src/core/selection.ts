import { TextNode } from "../nodes/text";
import { findNearestParentTreeNode } from "../utils";
import { EventBus, EventBusProtocol } from "./event-bus";
import { GroupNode, TreeNode, deepCopyNode, copyNode, findPathToNode, insertAfter, produceTraverse, insertBefore } from "./tree";

export const selectionChangedEvent = Symbol('selection_changed');

export interface EditorEventBusProtocol extends EventBusProtocol {
    selectionChanged: { type: typeof selectionChangedEvent, selection: Selection };
}

export class Selection extends EventBus<EditorEventBusProtocol> {
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

    startNode(root: TreeNode): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentTreeNode(root, this.range!.startContainer as HTMLElement);
    }

    endNode(root: TreeNode): TreeNode | null {
        if (!this.isSomethingSelected) {
            return null;
        }

        return findNearestParentTreeNode(root, this.range!.endContainer as HTMLElement);
    }

    updateSelection(node: Node) {
        this.domNode = node;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selection = this.selection = (node as any).getSelection() as globalThis.Selection;
        this.range = selection.getRangeAt(0);
        this.emit('selectionChanged', { type: selectionChangedEvent, selection: this });
    }

    surroundContents(root: GroupNode, group: GroupNode): GroupNode {
        if (!this.isSomethingSelected) {
            return root;
        }

        const start = (this.startNode(root) as TextNode);
        const end = (this.endNode(root) as TextNode);

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
            && start !== end
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
            start === end ? leftSliceNewNode as TextNode : end,
            start === end ? this.range!.endOffset - this.range!.startOffset : this.range!.endOffset,
            'left'
        );

        return produceTraverse(rightSliceResult, draft => {
            if (draft.id === commonParent.id) {
                let startIndex = 0;
                let endIndex = 0;
                let i = 0;

                while (i < (draft as GroupNode).children.length) {
                    if ((draft as GroupNode).children[i].id === leftSliceNewNode!.id) {
                        startIndex = i;
                    }

                    if ((draft as GroupNode).children[i].id === rightSliceNewNode!.id) {
                        endIndex = i;
                    }

                    i++;
                }

                if (startIndex > endIndex) {
                    const tmp = startIndex;
                    startIndex = endIndex;
                    endIndex = tmp;
                }

                if (start !== end) {
                    endIndex += 1;
                }

                const toWrap = (draft as GroupNode).children.splice(startIndex, endIndex - startIndex);

                group.children.push(...toWrap);

                (draft as GroupNode).children.splice(startIndex, 0, group);

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
