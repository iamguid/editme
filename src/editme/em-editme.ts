import { LitElement } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';

import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { testtree } from '../testtree';
import { StateController } from './state-controller';

import '../inline-toolbar/em-inline-toolbar';
import '../block-selector/em-block-selector';
import { rootContext } from '../root-context';

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    editmeRef: Ref<HTMLDivElement> = createRef();

    @provide({ context: rootContext })
    root = this.editmeRef;

    stateController = new StateController(this);

    override render() {
        return html`
            <div ${ref(this.editmeRef)} class="editme">
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