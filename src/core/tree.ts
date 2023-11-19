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
            id: crypto.randomUUID(),
            children: []
        }
    } else {
        return {
            ...node,
            id: crypto.randomUUID(),
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

// export const findTokensBetween = (tree: GroupNode, nodeA: TreeNode, nodeB: TreeNode): TreeNode[] => {
//     const recursiveFlatTokensList = (node: TreeNode): TreeNode[] => {
//         const result: TreeNode[] = [];

//         if (node.type === 'group') {
//             for (const child of node.children) {
//                 result.push(...recursiveFlatTokensList(child))
//             }
//         } else {
//             result.push(node)
//         }

//         return result;
//     }

//     const flatTokensList = recursiveFlatTokensList(tree);
//     const nodeIndexA = flatTokensList.findIndex(node => node.id === nodeA.id);
//     const nodeIndexB = flatTokensList.findIndex(node => node.id === nodeB.id);

//     return flatTokensList.slice(nodeIndexA + 1, nodeIndexB);
// }

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
