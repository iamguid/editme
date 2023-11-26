/* eslint-disable @typescript-eslint/no-explicit-any */

import { TemplateResult } from "lit";
import { TreeNode } from "./tree";

export type Template<TTreeNode extends TreeNode> = (node: TTreeNode, templates: Templates) => TemplateResult | Element | Text;

export class Templates {
    private templates = new Map<string, Template<any>>();

    register(id: string, template: Template<any>) {
        this.templates.set(id, template);
    }

    unregister(id: string) {
        this.templates.delete(id);
    }

    render(id: string, node: TreeNode): TemplateResult | Element | Text {
        const template = this.templates.get(id);

        if (!template) {
            throw new Error(`Template with id ${id} not found`);
        }

        return template(node, this);
    }
}