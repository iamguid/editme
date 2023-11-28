import { LitElement } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { testtree } from '../testtree';
import { StateController } from './state-controller';
import '../inline-toolbar/em-inline-toolbar';

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    stateController = new StateController(this);

    override render() {
        return html`
            ${this.editor.templates.render(this.editor.state)}
            <em-inline-toolbar/>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-editme': EditmeElement;
    }
}