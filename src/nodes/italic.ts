import { html } from "lit";

import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { Template } from "../core/templates";

export interface ItalicNode extends GroupNode {
}

export const createItalicNode = (children: TreeNode[] = []): ItalicNode => ({
    id: randomUUID(),
    type: 'group',
    view: 'italic-node',
    children,
})

export const italicNodeTemplate: Template<ItalicNode> = (node, templates) => {
    return html`<i>${node.children.map(child => templates.render(child.view, child))}</i>`;
}
