import { LitElement } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { literal, html } from "lit/static-html.js";

import { GroupNode, TreeNode } from "../core/tree";
import { InlineTool } from "../core/inline-tool";
import { editorContext } from "../editor-context";
import { Editor } from "../core/editor";
import { randomUUID } from "../core/utils";
import { Template } from "../core/templates";

export interface BoldNode extends GroupNode {
}

export const createBoldNode = (children: TreeNode[] = []): BoldNode => ({
    id: randomUUID(),
    type: 'group',
    kind: 'bold-node',
    children
})

export const boldNodeTemplate: Template<BoldNode> = (node, render) => {
    return html`<b id="${node.id}">${node.children.map(child => render(child))}</b>`;
}

export const boldInlineTool: InlineTool = {
    id: 'boold-inline-tool',
    component: literal`em-bold-tool`
}

@customElement('em-bold-tool')
export class BoldToolElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    onClick = () => {
        const boldNode = createBoldNode();
        this.editor.selection.surround(boldNode);
    }

    override render() {
        return html`<button @click=${this.onClick}>B</button>`
    }
}