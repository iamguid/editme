import { ReactiveController } from "lit";
import { BlockSelectorElement } from "./em-block-selector";
import { findById } from "../core/tree";
import { findNearestParentTreeNode } from "../core/utils";

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
        const tracedBlocks = this.traceBlocks([e.pageX, e.pageY]).reverse();
        this.startPositionElement = tracedBlocks[0];
        this.captureSelection = true;
        this.startPosition = [e.pageX, e.pageY];
        this.endPosition = [e.pageX, e.pageY];

        const composedPath = e.composedPath();
        const lastElement = composedPath[0] as HTMLElement;
        const lastElementHasText = Array.from(lastElement.childNodes).some(child => {
            return (child instanceof Text || child instanceof HTMLSpanElement) && (child.textContent?.trim().length ?? 0) > 0
        });
        const nearestTreeNode = findNearestParentTreeNode(this.host.editor.state, lastElement);

        if (!this.startPositionElement || (nearestTreeNode?.view === 'block' && !lastElementHasText)) {
            this.crossBlockSelection = true;
        }

        // Reset selection that was made previously
        this.host.editor.blockSelection.selectedNodes = new Set();
    }

    onMouseUp = () => {
        this.captureSelection = false;
        this.crossBlockSelection = false;
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.host.requestUpdate();
    }

    onMouseMove = (e: MouseEvent) => {
        if (!this.captureSelection) {
            return;
        }

        if (!this.crossBlockSelection) {
            if (!this.startPositionElement) {
                return;
            }

            const rect = this.getAbsoluteRect(this.startPositionElement);
            const endPositionElement = this.traceBlocks([e.pageX, e.pageY]).reverse()[0] ?? null;

            if (!this.isPointInRect([e.pageX, e.pageY], rect) && endPositionElement.hasAttribute('data-node')) {
                this.crossBlockSelection = true;
                // TODO: fix selection
                this.host.editor.inlineSelection.resetSelection();
                document.getSelection()?.collapseToStart();
            }
        }

        if (!this.crossBlockSelection) {
            return;
        }

        e.preventDefault();

        this.endPosition = [e.pageX, e.pageY];
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
        const elements = document.querySelectorAll('.em-block[data-node]')
        const result: Set<string> = new Set();

        for (const element of elements) {
            const elementRect = this.getAbsoluteRect(element);
            const selectionRect: Rect = [this.x, this.y, this.w, this.h]

            const hasIntersection = this.isRectIntersects(selectionRect, elementRect);
            const elementContainsSelection = this.isRectContains(elementRect, selectionRect);
            const isStartPositionElement = element === this.startPositionElement;

            if (hasIntersection && (!elementContainsSelection || isStartPositionElement)) {
                result.add(element.getAttribute('data-node')!);
            }
        }

        for (const id1 of result) {
            const node1 = findById(this.host.editor.state, id1);

            if (!node1) {
                throw new Error(`Node with id ${id1} not found`);
            }

            for (const id2 of result) {
                if (id1 === id2) {
                    continue;
                }

                const isParent = findById(node1, id2);

                if (isParent) {
                    result.delete(id2);
                }
            }
        }

        return result;
    }

    private traceBlocks(p: Point): Element[] {
        const elements = document.querySelectorAll('.em-block[data-node]')
        const result: Element[] = [];

        for (const element of elements) {
            const r = this.getAbsoluteRect(element)
            if (this.isPointInRect(p, r)) {
                result.push(element);
            }
        }

        return result;
    }

    private getAbsoluteRect(element: Element): Rect {
        const rect = element.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();

        return [rect.x - bodyRect.x, rect.y - bodyRect.y, rect.width, rect.height];
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