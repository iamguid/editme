import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GroupNode, TreeNode } from "../core/tree"
import { literal } from "lit/static-html.js";
import { randomUUID } from "../core/utils";

export interface RootNode extends GroupNode {
}

export const createRootNode = (children: TreeNode[] = []): RootNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-root-node`,
    children,
});

@customElement('em-root-node')
export class RootNodeElement extends LitElement {
    @property({ type: Object, attribute: false })
    node!: RootNode;

    override render() {
        return Array.from(this.children);
    }

    protected createRenderRoot() {
        return this;
    }
}