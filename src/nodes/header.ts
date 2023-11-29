import { html } from "lit";

import { Template } from "../core/templates";
import { GroupNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { createTextNode } from "./text";

export enum HeaderLevel {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
}

export interface HeaderNode extends GroupNode {
    level: HeaderLevel
}

export const createHeaderNode = (text: string, level: HeaderLevel = HeaderLevel.H1): HeaderNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'header-node',
    view: 'block',
    editable: true,
    level,
    children: [createTextNode(text)],
})

export const headerNodeTemplate: Template<HeaderNode> = (editor, node, render) => {
    const children = node.children.map(child => render(child));

    switch (node.level) {
        case HeaderLevel.H1: return html`<h1>${children}</h1>`;
        case HeaderLevel.H2: return html`<h2>${children}</h2>`;
        case HeaderLevel.H3: return html`<h3>${children}</h3>`;
        case HeaderLevel.H4: return html`<h4>${children}</h4>`;
        case HeaderLevel.H5: return html`<h5>${children}</h5>`;
        case HeaderLevel.H6: return html`<h6>${children}</h6>`;
    }
}
