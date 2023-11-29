import { html } from "lit";

import { Template } from "../core/templates";
import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";

export interface ContainerNode extends GroupNode {
}

export const createContainerNode = (children: TreeNode[] = []): ContainerNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'container-node',
    view: 'block',
    editable: false,
    children,
})

export const containerNodeTemplate: Template<ContainerNode> = (editor, node, render) => {
    return html`<div class="em-container">${node.children.map(child => render(child))}</div>`;
}