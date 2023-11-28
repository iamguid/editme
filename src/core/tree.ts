import { produce } from "immer"
import { randomUUID } from "./utils"
import { TextNode } from "../nodes/text"

export interface GroupNode {
    id: string
    kind: string
    type: 'group'
    children: TreeNode[]
}

export interface TokenNode {
    id: string
    kind: string
    type: 'token'
}

export type TreeNode = GroupNode | TokenNode

export const findById = (node: TreeNode, id: string): TreeNode | null => {
    const stack: TreeNode[] = [node];

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (current.id === id) {
            return current;
        }

        if (current.type === 'group') {
            stack.push(...current.children)
        }
    }

    return null
}

export const findPathToNode = (node: TreeNode, id: string): TreeNode[] => {
    const stack: (TreeNode | null)[] = [node];
    const path: TreeNode[] = [];

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (current === null) {
            path.pop();
            continue
        }

        if (current.id === id) {
            path.push(current)
            return path
        }

        if (current.type === 'group') {
            path.push(current)
            stack.push(null, ...current.children)
        }
    }

    return []
}

export const copyNode = (node: TreeNode): TreeNode => {
    if (node.type === 'group') {
        return {
            ...node,
            id: randomUUID(),
            children: []
        }
    } else {
        return {
            ...node,
            id: randomUUID(),
        }
    }
}

export const deepCopyNode = (node: TreeNode): TreeNode => {
    const result = copyNode(node);

    if (result.type === 'group' && node.type === 'group') {
        result.children = node.children.map(deepCopyNode)
    } else {
        return result;
    }

    return result;
}

export const calculateIndexMap = (node: GroupNode): Map<string, number> => {
    const result = new Map<string, number>();

    const recursive = (node: TreeNode) => {
        if (node.type === 'group') {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                result.set(child.id, i)

                recursive(child);
            }
        }
    }

    recursive(node)

    return result;
}

export const deleteById = (node: GroupNode, id: string): GroupNode => {
    return produceTraverse(node, draft => {
        if (draft.type === 'group') {
            const index = draft.children.findIndex(child => child.id === id)

            if (index > -1) {
                draft.children.splice(index, 1)
                return true;
            }

        }

        return false
    })
}

export const insertBefore = (node: GroupNode, id: string, element: TreeNode): GroupNode => {
    return produceTraverse(node, draft => {
        if (draft.type === 'group') {
            const index = draft.children.findIndex(child => child.id === id)

            if (index > -1) {
                draft.children.splice(index, 0, element)
                return true;
            }
        }

        return false
    })
}

export const insertAfter = (node: GroupNode, id: string, element: TreeNode): GroupNode => {
    return produceTraverse(node, draft => {
        if (draft.type === 'group') {
            const index = draft.children.findIndex(child => child.id === id)

            if (index > -1) {
                draft.children.splice(index + 1, 0, element)
                return true;
            }
        }

        return false
    })
}

export const moveById = (node: GroupNode, id: string, afterId: string): GroupNode => {
    const nodeToMove = findById(node, id);

    if (!nodeToMove) {
        return node
    }

    return insertAfter(deleteById(node, id), afterId, nodeToMove);
}

export const surround = (root: GroupNode, startNode: TextNode, endNode: TextNode, startOffset: number, endOffset: number, group: GroupNode): GroupNode => {
    const startPath = findPathToNode(root, startNode.id);
    const endPath = findPathToNode(root, endNode.id);

    let commonParentIndex = 0;
    while (
        commonParentIndex + 1 < startPath.length
        && commonParentIndex + 1 < endPath.length
        && startPath[commonParentIndex + 1] === endPath[commonParentIndex + 1]
        && startNode !== endNode
    ) {
        commonParentIndex++;
    }

    const commonParent = startPath[commonParentIndex] as GroupNode;

    const { result: leftSliceResult, newNode: leftSliceNewNode } = sliceByTextNode(
        root,
        commonParent,
        startNode,
        startOffset,
        'right'
    );

    const { result: rightSliceResult, newNode: rightSliceNewNode } = sliceByTextNode(
        leftSliceResult,
        commonParent,
        startNode === endNode ? leftSliceNewNode as TextNode : endNode,
        startNode === endNode ? endOffset - startOffset : endOffset,
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

            if (startNode !== endNode) {
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

export const sliceByTextNode = (root: GroupNode, sliceNode: GroupNode, textNode: TextNode, offset: number, mode: 'left' | 'right'): { result: GroupNode, newNode: TreeNode | null } => {
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

export const produceTraverse = (node: GroupNode, callback: (element: TreeNode) => boolean) => {
    return produce(node, draft => {
        const stack: TreeNode[] = [draft];

        while (stack.length > 0) {
            const current = stack.pop()!;

            if (callback(current)) {
                return draft
            }

            if (current.type === 'group') {
                stack.push(...current.children)
            }
        }

        return draft
    })
}
