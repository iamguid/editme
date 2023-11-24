import { LitElement } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { literal, html } from "lit/static-html.js";

import { GroupNode, TreeNode } from "../core/tree";
import { InlineTool } from "../core/inline-tool";
import { editorContext } from "../editor-context";
import { Editor } from "../core/editor";
import { randomUUID } from "../core/utils";
import { GroupNodeLitElement } from "../node-element";

export interface BoldNode extends GroupNode {
}

export const createBoldNode = (children: TreeNode[] = []): BoldNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-bold-node`,
    children
})

@customElement('em-bold-node')
export class BoldNodeElement extends GroupNodeLitElement<BoldNode> {
    override render() {
        return html`<b>${this.renderChildren()}</b>`;
    }

    protected createRenderRoot() {
        return this;
    }
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