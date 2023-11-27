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
    view: 'bold-node',
    children
})

export const boldNodeTemplate: Template<BoldNode> = (node, templates) => {
    return html`<b id="${node.id}">${node.children.map(child => templates.render(child.view, child))}</b>`;
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
        this.editor.do((editor) => editor.selection.surroundContents(editor.state, boldNode));
    }

    override render() {
        return html`<button @click=${this.onClick}>B</button>`
    }
}