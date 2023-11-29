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
    view: 'block',
    editable: true,
    children,
})

export const paragraphNodeTemplate: Template<ParagraphNode> = (editor, node, render) => {
    return html`<p>${node.children.map(child => render(child))}</p>`;
}
