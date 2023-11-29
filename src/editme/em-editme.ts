import { LitElement } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { testtree } from '../testtree';
import { StateController } from './state-controller';

import '../inline-toolbar/em-inline-toolbar';
import '../block-selector/em-block-selector';

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    stateController = new StateController(this);

    override render() {
        return html`
            <div class="editme">
                ${this.editor.templates.render(this.editor.state)}
                <em-inline-toolbar></em-inline-toolbar>
                <em-block-selector></em-block-selector>
            </div>
        `
    }

    protected override createRenderRoot() {
        return this;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-editme': EditmeElement;
    }
}