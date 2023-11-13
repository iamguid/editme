import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('em-inline-toolbar')
export class InlineToolbarElement extends LitElement {
    static override styles = css`
        div {
            display: block;
            width: 100%;
        }
    `;

    override render() {
        return html`
            <div>

            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'em-inline-toolbar': InlineToolbarElement;
    }
}