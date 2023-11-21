import { LitElement, html } from "lit";
import { GroupNode, TreeNode } from "../core/tree";
import { customElement, property } from "lit/decorators.js";
import { literal } from "lit/static-html.js";
import { randomUUID } from "../core/utils";

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
export class LinkNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: LinkNode;

    override render() {
        return html`<a href=${this.node.link}>${Array.from(this.children)}</a>`;
    }

    protected createRenderRoot() {
        return this;
    }
}