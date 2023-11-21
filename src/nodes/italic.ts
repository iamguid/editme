import { customElement, property } from "lit/decorators.js";
import { GroupNode, TreeNode } from "../core/tree";
import { LitElement, html } from "lit";
import { literal } from "lit/static-html.js";
import { randomUUID } from "../core/utils";

export interface ItalicNode extends GroupNode {
}

export const createItalicNode = (children: TreeNode[] = []): ItalicNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-italic-node`,
    children,
})

@customElement('em-italic-node')
export class ItalicNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: ItalicNode;

    override render() {
        return html`<i>${Array.from(this.children)}</i>`;
    }

    protected createRenderRoot() {
        return this;
    }
}