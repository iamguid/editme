import { ReactiveController, ReactiveControllerHost } from "lit";
import { Ref } from "lit/directives/ref.js";

import { Rect, getAbsoluteRect } from "../core/utils";
import { Editor } from "../core/editor";

export interface BlockSelectionControllerHost extends ReactiveControllerHost {
    editor: Editor
    root: Ref<HTMLDivElement>
}

export class BlockSelectionController implements ReactiveController {
    host: BlockSelectionControllerHost;

    constructor(host: BlockSelectionControllerHost) {
        (this.host = host).addController(this);
    }

    onMouseDown = (e: MouseEvent) => {
        const elements = this.host.root.value!.querySelectorAll('[data-node]');
        const rects = new Map<string, Rect>();

        for (const element of elements) {
            const rect = getAbsoluteRect(element as HTMLElement);
            rects.set(element.getAttribute('data-node')!, rect);
        }

        this.host.editor.blockSelection.nodesRects = rects;
        this.host.editor.blockSelection.onMouseDown([e.pageX, e.pageY]);
    }

    onMouseUp = () => {
        this.host.editor.blockSelection.onMouseUp()
    }

    onMouseMove = (e: MouseEvent) => {
        this.host.editor.blockSelection.onMouseMove([e.pageX, e.pageY])

        if (this.host.editor.blockSelection.isCrossBlockSelection) {
            e.preventDefault();
            
            // Reset focus on activeElement
            (document?.activeElement as HTMLElement | null)?.blur();
        }
    }

    hostConnected() {
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
    }

    hostDisconnected() {
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    }
}