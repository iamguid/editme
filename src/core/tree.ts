import { produce } from "immer"
import { StaticValue } from "lit/static-html.js"

export interface GroupNode {
    id: string
    type: 'group'
    view: StaticValue
    children: TreeNode[]
}

export interface TokenNode {
    id: string
    type: 'token'
    view: StaticValue
}

export type TreeNode = GroupNode | TokenNode

export const findById = (node: TreeNode, id: string): TreeNode | null => {
    const stack: TreeNode[] = [node];

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (current.type === 'group') {
            stack.push(...current.children)
        }

        if (current.id === id) {
            return current;
        }
    }

    return null
}

export const deleteById = (node: TreeNode, id: string): TreeNode => {
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

export const insertAfter = (node: TreeNode, id: string, element: TreeNode): TreeNode => {
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

export const moveById = (node: TreeNode, id: string, afterId: string): TreeNode => {
    const nodeToMove = findById(node, id);

    if (!nodeToMove) {
        return node
    }

    return insertAfter(deleteById(node, id), afterId, nodeToMove);
}

export const produceTraverse = (node: TreeNode, callback: (element: TreeNode) => boolean) => {
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
