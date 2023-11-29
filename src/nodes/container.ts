import { TemplateResult, html } from "lit";
import { classMap } from "lit/directives/class-map.js";

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
    children,
})

export const containerNodeTemplate: Template<ContainerNode> = (editor, node, render) => {
    const wrapper = (children: TemplateResult) => {
        const classes = {
            "em-container": true,
            "em-block": true,
            "em-block--selected": editor.blockSelection.isNodeSelected(node.id),
        };

        return html`
            <div data-node="${node.id}" class=${classMap(classes)}>
                ${children}
                <div class="em-spacer"/>
            </div>
        `;
    }

    return wrapper(html`${node.children.map(child => render(child))}`)
}