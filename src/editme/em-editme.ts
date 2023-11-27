import { LitElement } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { GroupNode } from '../core/tree';
import { testtree } from '../testtree';
import { boldInlineTool, boldNodeTemplate } from '../nodes/bold';
import { rootNodeTemplate } from '../nodes/root';
import { headerNodeTemplate } from '../nodes/header';
import { paragraphNodeTemplate } from '../nodes/paragraph';
import { textNodeTemplate } from '../nodes/text';
import { italicNodeTemplate } from '../nodes/italic';
import { editorNodeBlockTemplate } from '../nodes/editor-block/editor-block';

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    constructor() {
        super();

        this.editor.registerTemplate('root', rootNodeTemplate);
        this.editor.registerTemplate('header-node', headerNodeTemplate);
        this.editor.registerTemplate('paragraph-node', paragraphNodeTemplate);
        this.editor.registerTemplate('text-node', textNodeTemplate);
        this.editor.registerTemplate('bold-node', boldNodeTemplate);
        this.editor.registerTemplate('italic-node', italicNodeTemplate);
        this.editor.registerTemplate('editor-block', editorNodeBlockTemplate);

        this.editor.registerInlineTool(boldInlineTool);
    }

    get rootNode(): GroupNode {
        return this.editor.state;
    }

    override render() {
        return html`
            ${this.editor.templates.render('root', this.rootNode)}
            <em-inline-toolbar/>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-editme': EditmeElement;
    }
}