import { html } from "lit";

import { Template } from "../core/templates";
import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";

export interface ParagraphNode extends GroupNode {
}

export const createParagraphNode = (children: TreeNode[] = []): ParagraphNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'paragraph-node',
    children,
})

export const paragraphNodeTemplate: Template<ParagraphNode> = (node, render) => {
    return html`<p id="${node.id}">${node.children.map(child => render(child))}</p>`;
}
