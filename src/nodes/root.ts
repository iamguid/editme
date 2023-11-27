import { html } from "lit";

import { GroupNode, TreeNode } from "../core/tree"
import { randomUUID } from "../core/utils";
import { Template } from "../core/templates";

export interface RootNode extends GroupNode {
}

export const createRootNode = (children: TreeNode[] = []): RootNode => ({
    id: randomUUID(),
    type: 'group',
    view: 'root-node',
    children,
});

export const rootNodeTemplate: Template<RootNode> = (node, templates) => {
    return html`<div id="${node.id}">${node.children.map(child => templates.render(child.view, child))}</div>`;
}
