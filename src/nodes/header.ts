import { TemplateResult, html } from "lit";
import { classMap } from 'lit/directives/class-map.js';

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
    kind: 'header-node',
    view: 'block',
    level,
    text,
})

export const headerNodeTemplate: Template<HeaderNode> = (editor, node) => {
    const wrapper = (children: TemplateResult) => {
        const classes = {
            "em-block": true,
            "em-block--selected": editor.blockSelection.isNodeSelected(node.id)
        };

        return html`
            <div data-node="${node.id}" class=${classMap(classes)}>
                <div class="em-block__content">
                    ${children}
                </div>
            </div>
        `;
    }

    switch (node.level) {
        case HeaderLevel.H1: return wrapper(html`<h1>${node.text}</h1>`);
        case HeaderLevel.H2: return wrapper(html`<h2>${node.text}</h2>`);
        case HeaderLevel.H3: return wrapper(html`<h3>${node.text}</h3>`);
        case HeaderLevel.H4: return wrapper(html`<h4>${node.text}</h4>`);
        case HeaderLevel.H5: return wrapper(html`<h5>${node.text}</h5>`);
        case HeaderLevel.H6: return wrapper(html`<h6>${node.text}</h6>`);
    }
}
