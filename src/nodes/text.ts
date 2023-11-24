import { customElement, property } from "lit/decorators.js";
import { TokenNode } from "../core/tree";
import { LitElement, html } from "lit";
import { literal } from "lit/static-html.js";
import { randomUUID } from "../core/utils";
import { TokenNodeLitElement } from "../node-element";

export interface TextNode extends TokenNode {
    text: string
}

export const createTextNode = (text: string): TextNode => ({
    id: randomUUID(),
    type: 'token',
    view: literal`em-text-node`,
    text
})

@customElement('em-text-node')
export class ItalicNodeElement extends TokenNodeLitElement<TextNode> {
    override render() {
        return html`${this.node.text}`;
    }

    protected createRenderRoot() {
        return this;
    }
}