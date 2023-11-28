import { TemplateResult } from "lit";
import { TreeNode } from "./tree";
import { AbstractModule } from "./module";
import { EventBusProtocol } from "./event-bus";

export type Template<TTreeNode extends TreeNode> = (node: TTreeNode, render: (node: TreeNode) => TemplateResult | Element | Text) => TemplateResult | Element | Text;

export class TemplatesModule extends AbstractModule<EventBusProtocol> {
    private templates = new Map<string, Template<TreeNode>>();

    register<TTreeNode extends TreeNode>(kind: string, template: Template<TTreeNode>) {
        this.templates.set(kind, template as never);
    }

    unregister(kind: string) {
        this.templates.delete(kind);
    }

    render<TTreeNode extends TreeNode>(node: TTreeNode): TemplateResult | Element | Text {
        const template = this.templates.get(node.kind);

        if (!template) {
            throw new Error(`Template with id ${node.kind} not found`);
        }

        return template(node, this.render.bind(this));
    }
}