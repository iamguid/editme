import { LitElement, css } from 'lit';
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';
import { editorContext } from '../editor-context';
import { consume } from '@lit/context';
import { styleMap } from 'lit/directives/style-map.js';
import { Editor } from '../core/editor';
import { SelectionController } from './selection-controller';
import { Ref, createRef, ref } from 'lit/directives/ref.js';

@customElement('em-inline-toolbar')
export class InlineToolbarElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    selectionController = new SelectionController(this);

    containerRef: Ref<HTMLDivElement> = createRef();

    get selectionRect() {
        return this.editor.selection.range?.getBoundingClientRect();
    }

    get containerRect() {
        return this.containerRef.value?.getBoundingClientRect();
    }

    get toolbarX() {
        if (!this.containerRect || !this.selectionRect) {
            return 0;
        }

        return `${this.selectionRect!.left + this.selectionRect!.width / 2 - this.containerRect!.width / 2}px`;
    }

    get toolbarY() {
        if (!this.containerRect || !this.selectionRect) {
            return 0;
        }

        return `${this.selectionRect!.top + this.selectionRect!.height + 5}px`;
    }
    
    static override styles = css`
        .container {
            position: absolute;
            display: flex;
            flex-direction: row;
            gap: 5px;
            border-radius: 5px;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 3px 5px;
            transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }

        .hidden {
            opacity: 0;
            transform: translateY(5px);
        }

        .show {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    override render() {
        return html`
            <div
                class="container ${this.editor.selection.isSomethingSelected ? 'show' : 'hidden'}"
                style=${styleMap({left: this.toolbarX, top: this.toolbarY})}
                ${ref(this.containerRef)}
            >
                ${this.editor.tools.map(tool => html`<${tool.component}/>`)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-inline-toolbar': InlineToolbarElement;
    }
}