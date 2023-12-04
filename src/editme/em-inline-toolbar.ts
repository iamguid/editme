import { LitElement, css } from 'lit';
import { html } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';
import { editorContext } from '../editor-context';
import { consume } from '@lit/context';
import { styleMap } from 'lit/directives/style-map.js';
import { Editor } from '../core/editor';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { Rect, getAbsoluteRect } from '../core/utils';

@customElement('em-inline-toolbar')
export class InlineToolbarElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    selectionRect: Rect = [0, 0, 0, 0];
    containerRect: Rect = [0, 0, 0, 0];

    containerRef: Ref<HTMLDivElement> = createRef();

    private updateSelectionRect() {
        if (this.editor.inlineSelection.firstRange?.commonAncestorContainer) {
            const r = this.editor.inlineSelection.firstRange?.getBoundingClientRect();
            this.selectionRect = [r.x + window.scrollX, r.y + window.scrollY, r.width, r.height];
        }
    }

    private updateContainerRect() {
        if (this.containerRef.value) {
            this.containerRect = getAbsoluteRect(this.containerRef.value as HTMLElement);
        }
    }

    get toolbarX() {
        return `${this.selectionRect[0] + this.selectionRect[2] / 2 - this.containerRect[2] / 2}px`;
    }

    get toolbarY() {
        return `${this.selectionRect[1] + this.selectionRect[3] + 5}px`;
    }

    private onSomethingChanged = () => {
        this.updateSelectionRect();
        this.updateContainerRect();
        this.requestUpdate();
    }

    protected firstUpdated(): void {
        this.editor.inlineSelection.on('selectionChanged', this.onSomethingChanged);
    }

    disconnectedCallback(): void {
        this.editor.inlineSelection.off('selectionChanged', this.onSomethingChanged);
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
            transition: opacity 0.15s ease-out, transform 0.15s ease-out;
        }

        .hidden {
            opacity: 0;
            transform: translateY(10px);
        }

        .show {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    override render() {
        return html`
            <div
                class="container ${this.editor.inlineSelection.isSomethingSelected ? 'show' : 'hidden'}"
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