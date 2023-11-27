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
    view: 'link-node',
    link,
    children,
})

export const linkNodeTemplate: Template<LinkNode> = (node, templates) => {
    return html`<a id=${node.id} href="${node.link}">${node.children.map(child => templates.render(child.view, child))}</a>`;
}
