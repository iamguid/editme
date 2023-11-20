import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { GroupNode, TreeNode } from "../core/tree";
import { LitElement } from "lit";
import { literal, html } from "lit/static-html.js";
import { InlineTool } from "../core/inline-tool";
import { editorContext } from "../editor-context";
import { Editor } from "../core/editor";

export interface BoldNode extends GroupNode {
}

export const createBoldNode = (children: TreeNode[] = []): BoldNode => ({
    id: crypto.randomUUID(),
    type: 'group',
    view: literal`em-bold-node`,
    children
})

@customElement('em-bold-node')
export class BoldNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: BoldNode;

    override render() {
        return html`<b>${Array.from(this.children)}</b>`;
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