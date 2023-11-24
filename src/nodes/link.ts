import { literal, html } from "lit/static-html.js";
import { customElement } from "lit/decorators.js";

import { GroupNode, TreeNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { GroupNodeLitElement } from "../node-element";

export interface LinkNode extends GroupNode {
    link: string
}

export const createLinkNode = (link: string, children: TreeNode[] = []): LinkNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-link-node`,
    link,
    children,
})

@customElement('em-link-node')
export class LinkNodeElement extends GroupNodeLitElement<LinkNode> {
    override render() {
        return html`<a href=${this.node.link}>${this.renderChildren()}</a>`;
    }

    protected createRenderRoot() {
        return this;
    }
}