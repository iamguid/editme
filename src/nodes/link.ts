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
    view: 'inline',
    editable: false,
    link,
    children,
})

export const linkNodeTemplate: Template<LinkNode> = (editor, node, render) => {
    return html`<a data-node="${node.id}" href="${node.link}">${node.children.map(child => render(child))}</a>`;
}
