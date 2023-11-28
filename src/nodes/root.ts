import { html } from "lit";

import { GroupNode, TreeNode } from "../core/tree"
import { randomUUID } from "../core/utils";
import { Template } from "../core/templates";

export interface RootNode extends GroupNode {
}

export const createRootNode = (children: TreeNode[] = []): RootNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'root-node',
    view: 'block',
    children,
});

export const rootNodeTemplate: Template<RootNode> = (editor, node, render) => {
    return html`<div data-node="${node.id}">${node.children.map(child => render(child))}</div>`;
}
