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

export const getPathToNode = (node: TreeNode, id: string): TreeNode[] => {
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

export const findNodesBetween = (tree: TreeNode, nodeA: TreeNode, nodeB: TreeNode): TreeNode[] => {
    const queue: TreeNode[] = [nodeA];
    const visited = new Set<string>([nodeA.id]);
    const distances = new Map<string, number>([[nodeA.id, 0]]);
    const predecessors = new Map<string, TreeNode>();
 
    while (queue.length > 0) {
        const n = queue.shift() as GroupNode;
        for (let c of n.children) {
            if (visited.has(c.id) == false) {
                visited.add(c.id);
                distances.set(c.id, (distances.get(n.id) ?? 0) + 1);
                predecessors.set(c.id, n);
                queue.push(c);
 
                if (c == nodeB)
                    break;
            }
        }
    }

    console.log(distances, predecessors)

    return [];
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
