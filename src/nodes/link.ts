import { html } from "lit";

import { Template } from "../core/templates";
import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";

export interface LinkNode extends GroupNode {
    link: string
}

export const createLinkNode = (link: string, children: TreeNode[] = []): LinkNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'link-node',
    link,
    children,
})

export const linkNodeTemplate: Template<LinkNode> = (node, render) => {
    return html`<a id="${node.id}" href="${node.link}">${node.children.map(child => render(child))}</a>`;
}
