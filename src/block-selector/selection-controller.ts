import { ReactiveController } from "lit";
import { BlockSelectorElement } from "./em-block-selector";

export class SelectionController implements ReactiveController {
    host: BlockSelectorElement;

    isActivated = false;
    startPosition = [0, 0]
    endPosition = [0, 0];

    constructor(host: BlockSelectorElement) {
        (this.host = host).addController(this);
    }

    get x(): number {
        if (this.endPosition[0] < this.startPosition[0]) {
            return this.endPosition[0] - 1
        }

        return this.startPosition[0] + 1;
    }

    get y(): number {
        if (this.endPosition[1] < this.startPosition[1]) {
            return this.endPosition[1] - 1
        }

        return this.startPosition[1] + 1;
    }

    get width(): number {
        if (this.endPosition[0] < this.startPosition[0]) {
            return this.startPosition[0] - this.endPosition[0]
        }
        
        return this.endPosition[0] - this.startPosition[0];
    }

    get height(): number {
        if (this.endPosition[1] < this.startPosition[1]) {
            return this.startPosition[1] - this.endPosition[1]
        }
        
        return this.endPosition[1] - this.startPosition[1];
    }

    onMouseDown = (e: MouseEvent) => {
        const composedPath = e.composedPath();
        const lastNode = composedPath[0] as HTMLElement;
        const hasContenteditable = composedPath.some(node => node instanceof HTMLElement && node.isContentEditable);
        const isTextNode = Array.from(lastNode.childNodes).some(child => child instanceof Text);
        const isHtml = (lastNode instanceof HTMLHtmlElement);

        if (!isHtml && (isTextNode || hasContenteditable)) {
            return;
        }

        e.preventDefault();

        this.isActivated = true;
        this.startPosition = [e.clientX, e.clientY];
        this.endPosition = [e.clientX, e.clientY];
        this.host.requestUpdate();
    }

    onMouseUp = (e: MouseEvent) => {
        if (!this.isActivated) {
            return;
        }

        e.preventDefault();

        this.isActivated = false;
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.host.requestUpdate();
    }

    onMouseMove = (e: MouseEvent) => {
        if (!this.isActivated) {
            return;
        }

        e.preventDefault();

        this.endPosition = [e.clientX, e.clientY];
        this.host.editor.blockSelection.selectedNodes = this.getSelectedNodes();
        this.host.requestUpdate();
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

    private getSelectedNodes() {
        const nodes = document.querySelectorAll('.em-block[data-node]')
        const result: Set<string> = new Set();

        for (const node of nodes) {
            const rect = node.getBoundingClientRect();
            const r1 = [this.x, this.y, this.width, this.height]
            const r2 = [rect.x, rect.y, rect.width, rect.height]

            if (this.isRectIntersects(r1, r2)) {
                result.add(node.getAttribute('data-node')!);
            }
        }

        return result;
    }

    private isRectIntersects(rect1: number[], rect2: number[]) {
        return rect1[0] < rect2[0] + rect2[2] &&
            rect1[0] + rect1[2] > rect2[0] &&
            rect1[1] < rect2[1] + rect2[3] &&
            rect1[1] + rect1[3] > rect2[1];
    }
}