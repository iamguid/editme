import { customElement } from "lit/decorators.js";
import { literal, html } from "lit/static-html.js";

import { TokenNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { TokenNodeLitElement } from "../node-element";

export enum HeaderLevel {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
}

export interface HeaderNode extends TokenNode {
    level: HeaderLevel
    text: string
}

export const createHeaderNode = (text: string = '', level: HeaderLevel = HeaderLevel.H1): HeaderNode => ({
    id: randomUUID(),
    type: 'token',
    view: literal`em-header-node`,
    level,
    text,
})

@customElement('em-header-node')
export class HeaderNodeElement extends TokenNodeLitElement<HeaderNode> {
    renderH1 = () => html`<h1>${this.node.text}</h1>`
    renderH2 = () => html`<h2>${this.node.text}</h2>`
    renderH3 = () => html`<h3>${this.node.text}</h3>`
    renderH4 = () => html`<h4>${this.node.text}</h4>`
    renderH5 = () => html`<h5>${this.node.text}</h5>`
    renderH6 = () => html`<h6>${this.node.text}</h6>`

    override render() {
        switch (this.node.level) {
            case HeaderLevel.H1: return this.renderH1();
            case HeaderLevel.H2: return this.renderH2();
            case HeaderLevel.H3: return this.renderH3();
            case HeaderLevel.H4: return this.renderH4();
            case HeaderLevel.H5: return this.renderH5();
            case HeaderLevel.H6: return this.renderH6();
        }
    }

    protected createRenderRoot() {
        return this;
    }
}