import { html } from "lit";
import { Template } from "../core/templates";
import { TokenNode } from "../core/tree";
import { randomUUID } from "../core/utils";

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

export const createHeaderNode = (text: string, level: HeaderLevel = HeaderLevel.H1): HeaderNode => ({
    id: randomUUID(),
    type: 'token',
    view: 'header-node',
    level,
    text,
})

export const headerNodeTemplate: Template<HeaderNode> = (node) => {
    switch (node.level) {
        case HeaderLevel.H1: return html`<h1 id="${node.id}">${node.text}</h1>`;
        case HeaderLevel.H2: return html`<h2 id="${node.id}">${node.text}</h2>`;
        case HeaderLevel.H3: return html`<h3 id="${node.id}">${node.text}</h3>`;
        case HeaderLevel.H4: return html`<h4 id="${node.id}">${node.text}</h4>`;
        case HeaderLevel.H5: return html`<h5 id="${node.id}">${node.text}</h5>`;
        case HeaderLevel.H6: return html`<h6 id="${node.id}">${node.text}</h6>`;
    }
}
