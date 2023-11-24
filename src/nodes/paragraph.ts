import { customElement } from "lit/decorators.js";
import { literal, html } from "lit/static-html.js";

import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { GroupNodeLitElement } from "../node-element";

export interface ParagraphNode extends GroupNode {
}

export const createParagraphNode = (children: TreeNode[] = []): ParagraphNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-paragraph-node`,
    children,
})

@customElement('em-paragraph-node')
export class ParagraphNodeElement extends GroupNodeLitElement<ParagraphNode> {
    override render() {
        return html`<p>${this.renderChildren()}</p>`;
    }

    protected createRenderRoot() {
        return this;
    }
}