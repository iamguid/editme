import { TemplateResult, html } from "lit"
import { classMap } from "lit/directives/class-map.js"

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
    children,
})

export const columnsNodeTemplate: Template<ColumnsNode> = (editor, node, render) => {
    const wrapper = (children: TemplateResult) => {
        const classes = {
            "em-block": true,
            "em-block--selected": editor.blockSelection.isNodeSelected(node.id)
        };

        return html`
            <div data-node="${node.id}" class=${classMap(classes)}>
                <div class="em-block__content em-columns">
                    ${children}
                </div>
            </div>
        `;
    }

    return wrapper(html`${node.children.map(child => render(child))}`)
}