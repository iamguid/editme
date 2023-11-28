import { LitElement, css, html } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import { editorContext } from "../editor-context";
import { Editor } from "../core/editor";
import { SelectionController } from "./selection-controller";

@customElement('em-block-selector')
export class BlockSelectorElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    selectionController = new SelectionController(this);

    get x(): string {
        return `${this.selectionController.x}px`;
    }

    get y(): string {
        return `${this.selectionController.y}px`;
    }

    get w(): string {
        return `${this.selectionController.width}px`;
    }

    get h(): string {
        return `${this.selectionController.height}px`;
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
                class="rect ${this.selectionController.isActivated ? 'show' : 'hide'}" 
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