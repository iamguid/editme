import { LitElement, TemplateResult } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';

import { editorContext } from '../editor-context';
import { Editor } from '../core/editor';
import { stringHash, templateAsString } from '../core/utils';
import { MutationController } from './mutation-controller';
import { ClipboardController } from './clipboard-controller';

@customElement('em-editor-block')
export class EditorBlockElement extends LitElement {
    @consume({context: editorContext})
    editor!: Editor;

    @property({ attribute: false })
    childrenTemplate!: TemplateResult;

    editorRef: Ref<HTMLDivElement> = createRef();

    mutationController = new MutationController(this);
    pasteController = new ClipboardController(this);

    onInput = () => {
        this.requestUpdate();
    };

    get childrenInnerHTML() {
        return templateAsString(this.childrenTemplate);
    }

    override updated = () => {
        // Fix bug with rerendering innerHTML
        this.mutationController.ignoreNextMutation();
        this.editorRef.value!.innerHTML = this.childrenInnerHTML;
    }

    override render() {
        return html`
            <div
                class="em-editable"
                ${ref(this.editorRef)}
                @input=${this.onInput}
                contenteditable
                spellcheck
                autocomplete="off"
                autofill="off"
            ></div>
        `;
    }

    protected override shouldUpdate(): boolean {
        const currentHash = stringHash(this.editorRef.value?.innerHTML ?? '');
        const nextHash = stringHash(this.childrenInnerHTML);

        return currentHash !== nextHash;
    }

    protected override createRenderRoot() {
        return this;
    }
}
