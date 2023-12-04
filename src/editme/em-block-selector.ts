import { LitElement, css, html } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { Ref } from "lit/directives/ref.js";

import { editorContext } from "../editor-context";
import { Editor } from "../core/editor";
import { rootContext } from "../root-context";

@customElement('em-block-selector')
export class BlockSelectorElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    @consume({context: rootContext})
    root!: Ref<HTMLDivElement>;

    get x(): string {
        return `${this.editor.blockSelection.x}px`;
    }

    get y(): string {
        return `${this.editor.blockSelection.y}px`;
    }

    get w(): string {
        return `${this.editor.blockSelection.w}px`;
    }

    get h(): string {
        return `${this.editor.blockSelection.h}px`;
    }

    onSomethingChanged = () => {
        this.requestUpdate();
    }

    firstUpdated(): void {
        this.editor.blockSelection.on('selectionRectChanged', this.onSomethingChanged);
    }

    disconnectedCallback(): void {
        this.editor.blockSelection.off('selectionRectChanged', this.onSomethingChanged);
    }

    static override styles = css`
        .rect {
            position: absolute;
            z-index: 9999;
            background-color: rgba(121, 204, 255, 0.3);
            border: 1px solid rgba(121, 204, 255, 0.4);
        }

        .show {
            display: block;
        }

        .hide {
            display: none;
        }
    `;

    override render() {
        return html`
            <div 
                class="rect ${this.editor.blockSelection.isCrossBlockSelection ? 'show' : 'hide'}" 
                style=${styleMap({ left: this.x, top: this.y, width: this.w, height: this.h })}
            />
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-block-selector': BlockSelectorElement;
    }
}