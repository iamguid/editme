import { html } from "lit"

import { Template } from "../core/templates"
import { GroupNode } from "../core/tree"
import { randomUUID } from "../core/utils"
import { ContainerNode } from "./container"

export interface ColumnsNode extends GroupNode {
}

export const createColumnsNode = (children: ContainerNode[] = []): ColumnsNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'columns-node',
    view: 'block',
    editable: false,
    children,
})

export const columnsNodeTemplate: Template<ColumnsNode> = (editor, node, render) => {
    return html`<div class="em-columns">${node.children.map(child => render(child))}</div>`
}