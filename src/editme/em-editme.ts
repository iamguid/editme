import { LitElement } from 'lit';
import { provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';

import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { testtree } from '../testtree';
import { rootContext } from '../root-context';
import { InlineSelectionController } from './inline-selection-controller';
import { BlockSelectionController } from './block-selection-controller';

import './em-inline-toolbar';
import './em-block-selector';

@customElement('em-editme')
export class EditmeElement extends LitElement {
    @provide({ context: editorContext })
    editor = Editor.from(testtree);

    editmeRef: Ref<HTMLDivElement> = createRef();

    @provide({ context: rootContext })
    root = this.editmeRef;

    inlineSelectionController = new InlineSelectionController(this);
    blockSelectionController = new BlockSelectionController(this);

    onSomethingChanged = () => {
        this.requestUpdate();
    }

    firstUpdated(): void {
        this.editor.on('stateChanged', this.onSomethingChanged);
        this.editor.blockSelection.on('selectionChanged', this.onSomethingChanged);
    }

    hostDisconnected(): void {
        this.editor.off('stateChanged', this.onSomethingChanged);
        this.editor.blockSelection.off('selectionChanged', this.onSomethingChanged);
    }

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