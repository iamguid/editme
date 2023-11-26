import { html } from "lit";

import { TokenNode } from "../core/tree";
import { randomUUID } from "../core/utils";
import { Template } from "../core/templates";

export interface TextNode extends TokenNode {
    text: string
}

export const createTextNode = (text: string): TextNode => ({
    id: randomUUID(),
    type: 'token',
    view: 'text-node',
    text
})

export const textNodeTemplate: Template<TextNode> = (node) => {
    return html`<span .node=${node}>${node.text}</span>`;
}
