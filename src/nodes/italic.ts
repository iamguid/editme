import { literal, html } from "lit/static-html.js";
import { customElement } from "lit/decorators.js";

import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { GroupNodeLitElement } from "../node-element";

export interface ItalicNode extends GroupNode {
}

export const createItalicNode = (children: TreeNode[] = []): ItalicNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-italic-node`,
    children,
})

@customElement('em-italic-node')
export class ItalicNodeElement extends GroupNodeLitElement<ItalicNode> {
    override render() {
        return html`<i>${this.renderChildren()}</i>`;
    }

    protected createRenderRoot() {
        return this;
    }
}