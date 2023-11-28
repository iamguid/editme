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
    view: 'inline',
    children,
})

export const italicNodeTemplate: Template<ItalicNode> = (editor, node, render) => {
    return html`<i data-node="${node.id}">${node.children.map(child => render(child))}</i>`;
}
