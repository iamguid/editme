import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Selection } from './core/selection';

@customElement('em-inline-toolbar')
export class InlineToolbarElement extends LitElement {
    @property({
        type: Object,
        hasChanged: () => true,
    })
    selection!: Selection

    static override styles = css`
        div {
            display: block;
            width: 100%;
        }
    `;

    override render() {
        return html`
            <div>
                ${this.selection.isSomethingSelected}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-inline-toolbar': InlineToolbarElement;
    }
}