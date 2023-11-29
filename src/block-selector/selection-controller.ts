import { ReactiveController } from "lit";
import { BlockSelectorElement } from "./em-block-selector";
import { GroupNode, findById } from "../core/tree";

export type Rect = [number, number, number, number]; 
export type Point = [number, number]; 

export class SelectionController implements ReactiveController {
    host: BlockSelectorElement;

    crossBlockSelection = false;
    captureSelection = false;
    startPositionElement: Element | null = null;
    startPosition: Point = [0, 0]
    endPosition: Point = [0, 0];

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

    get w(): number {
        if (this.endPosition[0] < this.startPosition[0]) {
            return this.startPosition[0] - this.endPosition[0]
        }
        
        return this.endPosition[0] - this.startPosition[0];
    }

    get h(): number {
        if (this.endPosition[1] < this.startPosition[1]) {
            return this.startPosition[1] - this.endPosition[1]
        }
        
        return this.endPosition[1] - this.startPosition[1];
    }

    onMouseDown = (e: MouseEvent) => {
        const tracedBlocks = this.traceBlocks([e.clientX, e.clientY]).reverse();
        this.startPositionElement = tracedBlocks[0];
        this.captureSelection = true;
        this.startPosition = [e.clientX, e.clientY];
        this.endPosition = [e.clientX, e.clientY];

        this.host.editor.blockSelection.selectedNodes = new Set();
    }

    onMouseUp = (e: MouseEvent) => {
        this.captureSelection = false;
        this.crossBlockSelection = false;
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.host.requestUpdate();
    }

    onMouseMove = (e: MouseEvent) => {
        if (!this.startPositionElement || !this.captureSelection) {
            return;
        }

        const rect = this.startPositionElement.getBoundingClientRect();
        const r: Rect = [rect.x, rect.y, rect.width, rect.height];

        if (!this.isPointInRect([e.clientX, e.clientY], r)) {
            this.crossBlockSelection = true;
            this.host.editor.inlineSelection.resetSelection();
        }

        if (!this.crossBlockSelection) {
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
            const r1: Rect = [this.x, this.y, this.w, this.h]
            const r2: Rect = [rect.x, rect.y, rect.width, rect.height]

            if (this.isRectIntersects(r1, r2)) {
                result.add(node.getAttribute('data-node')!);
            }
        }

        return result;
    }

    private traceBlocks(p: Point): Element[] {
        const elements = document.querySelectorAll('.em-block[data-node]')
        const result: Element[] = [];

        for (const element of elements) {
            const elRect = element.getBoundingClientRect();
            const r: Rect = [elRect.x, elRect.y, elRect.width, elRect.height];
            if (this.isPointInRect(p, r)) {
                result.push(element);
            }
        }

        return result;
    }

    private isRectIntersects(rect1: Rect, rect2: Rect) {
        return rect1[0] < rect2[0] + rect2[2] &&
            rect1[0] + rect1[2] > rect2[0] &&
            rect1[1] < rect2[1] + rect2[3] &&
            rect1[1] + rect1[3] > rect2[1];
    }

    private isRectContains(rect1: Rect, rect2: Rect) {
        return rect1[0] <= rect2[0] &&
            rect1[0] + rect1[2] >= rect2[0] + rect2[2] &&
            rect1[1] <= rect2[1] &&
            rect1[1] + rect1[3] >= rect2[1] + rect2[3];
    }

    private isPointInRect(point: Point, rect: Rect) {
        return point[0] >= rect[0] &&
            point[0] <= rect[0] + rect[2] &&
            point[1] >= rect[1] &&
            point[1] <= rect[1] + rect[3];
    }
}