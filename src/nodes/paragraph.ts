import { html } from "lit";
import { classMap } from 'lit/directives/class-map.js';

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
    children,
})

export const paragraphNodeTemplate: Template<ParagraphNode> = (editor, node, render) => {
    const classes = {
        "em-block": true,
        "em-block--selected": editor.blockSelection.isNodeSelected(node.id)
    };

    return html`
        <div data-node="${node.id}" class=${classMap(classes)}>
            <div class="em-block__content">
                <p>${node.children.map(child => render(child))}</p>
            </div>
        </div>
    `;
}
