import { customElement, property } from "lit/decorators.js";
import { TokenNode } from "../core/tree";
import { LitElement, html } from "lit";
import { literal } from "lit/static-html.js";

export interface TextNode extends TokenNode {
    text: string
}

export const createTextNode = (text: string): TextNode => ({
    id: crypto.randomUUID(),
    type: 'token',
    view: literal`em-text-node`,
    text
})

@customElement('em-text-node')
export class ItalicNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: TextNode;

    override render() {
        return html`${this.node.text}`;
    }

    protected createRenderRoot() {
        return this;
    }
}