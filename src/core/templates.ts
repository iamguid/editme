import { TemplateResult, html } from "lit";
import { classMap } from "lit/directives/class-map.js";

import { GroupNode, TreeNode } from "./tree";
import { AbstractModule } from "./module";
import { EventBusProtocol } from "./event-bus";
import { Editor } from "./editor";

import '../editor-block/em-editor-block';

type TemplateRes = TemplateResult | Element | Text;

export type Template<TTreeNode extends TreeNode> = (editor: Editor, node: TTreeNode, render: (node: TreeNode) => TemplateRes) => TemplateRes;

export class TemplatesModule extends AbstractModule<EventBusProtocol> {
    private templates = new Map<string, Template<TreeNode>>();

    register<TTreeNode extends TreeNode>(kind: string, template: Template<TTreeNode>) {
        this.templates.set(kind, template as never);
    }

    unregister(kind: string) {
        this.templates.delete(kind);
    }

    wrapBlock(node: GroupNode, children: TemplateRes): TemplateRes {
        const classes = {
            "em-block": true,
            "em-block--selected": this.editor.blockSelection.isNodeSelected(node.id),
        };

        return html`
            <div data-node="${node.id}" class=${classMap(classes)}>
                ${children}
            </div>
        `;
    }

    wrapEditable(node: GroupNode, children: TemplateRes): TemplateRes {
        return html`<em-editor-block .childrenTemplate=${children}/>`;
    }

    render<TTreeNode extends TreeNode>(node: TTreeNode): TemplateRes {
        const template = this.templates.get(node.kind);

        if (!template) {
            throw new Error(`Template with id ${node.kind} not found`);
        }

        let result = template(this.editor, node, this.render.bind(this));

        if (node.view === 'block' && node.type === 'group' && node.editable) {
            result = this.wrapEditable(node, result);
        }

        if (node.view === 'block' && node.type === 'group') {
            result = this.wrapBlock(node, result);
        }

        return result;
    }
}