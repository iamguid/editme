import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GroupNode, TreeNode } from "../core/tree";
import { literal } from "lit/static-html.js";
import { randomUUID } from "../core/utils";

export interface ParagraphNode extends GroupNode {
}

export const createParagraphNode = (children: TreeNode[] = []): ParagraphNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-paragraph-node`,
    children,
})

@customElement('em-paragraph-node')
export class ParagraphNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: ParagraphNode;

    override render() {
        return html`<p>${Array.from(this.children)}</p>`;
    }

    protected createRenderRoot() {
        return this;
    }
}