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
    kind: 'text-node',
    view: 'inline',
    editable: false,
    text
})

export const textNodeTemplate: Template<TextNode> = (editor, node) => {
    return html`<span data-node="${node.id}">${node.text}</span>`;
}
