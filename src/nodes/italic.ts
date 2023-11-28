import { html } from "lit";

import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { Template } from "../core/templates";

export interface ItalicNode extends GroupNode {
}

export const createItalicNode = (children: TreeNode[] = []): ItalicNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'italic-node',
    children,
})

export const italicNodeTemplate: Template<ItalicNode> = (node, render) => {
    return html`<i id="${node.id}">${node.children.map(child => render(child))}</i>`;
}
