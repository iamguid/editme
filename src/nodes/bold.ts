import { customElement, property } from "lit/decorators.js";
import { GroupNode, TreeNode } from "../core/tree";
import { LitElement, html } from "lit";
import { literal } from "lit/static-html.js";

export interface BoldNode extends GroupNode {
}

export const createBoldNode = (children: TreeNode[] = []): BoldNode => ({
    id: crypto.randomUUID(),
    type: 'group',
    view: literal`em-bold-node`,
    children
})

@customElement('em-bold-node')
export class BoldNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: BoldNode;

    override render() {
        return html`<b>${Array.from(this.children)}</b>`;
    }

    protected createRenderRoot() {
        return this;
    }
}
