import { customElement } from "lit/decorators.js";
import { literal } from "lit/static-html.js";

import { GroupNode, TreeNode } from "../core/tree"
import { randomUUID } from "../core/utils";
import { GroupNodeLitElement } from "../node-element";

export interface RootNode extends GroupNode {
}

export const createRootNode = (children: TreeNode[] = []): RootNode => ({
    id: randomUUID(),
    type: 'group',
    view: literal`em-root-node`,
    children,
});

@customElement('em-root-node')
export class RootNodeElement extends GroupNodeLitElement<RootNode> {
    override render() {
        return this.renderChildren();
    }

    protected createRenderRoot() {
        return this;
    }
}
