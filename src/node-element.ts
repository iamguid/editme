import { LitElement } from "lit"
import { property } from "lit/decorators.js";
import { html } from "lit/static-html.js";

import { TreeNode } from "./core/tree";

export class NodeLitElement<TNode extends TreeNode> extends LitElement {
    @property({ type: Object, attribute: false })
    node!: TNode;
}

export class GroupNodeLitElement<TNode extends TreeNode> extends NodeLitElement<TNode> {
    protected renderChildren() {
        if (this.node.type !== 'group') {
            throw new Error(`Node ${this.node.id} is not a group node`);
        }

        return this.node.children.map(child => html`<${child.view} .node=${child}/>`);
    }
}

export class TokenNodeLitElement<TNode extends TreeNode> extends NodeLitElement<TNode> {
}