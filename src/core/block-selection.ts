import { EventBusProtocol } from "./event-bus";
import { AbstractModule } from "./module";
import { TreeNode, findById } from "./tree";
import { Point, Rect, isPointInRect, isRectContains, isRectIntersects, traceNodes } from "./utils";

export const selectionChangedEvent = Symbol('selection_changed');
export const selectionRectChangedEvent = Symbol('selection_rect_changed');

export interface BlockSelectionProtocol extends EventBusProtocol {
    selectionChanged: { type: typeof selectionChangedEvent }
    selectionRectChanged: { type: typeof selectionRectChangedEvent }
}

export class BlockSelectionModule extends AbstractModule<BlockSelectionProtocol> {
    private _selectedBlocks: Set<string> = new Set();
    private _nodesRects: Map<string, Rect> = new Map();
    private _blocksRects: Map<string, Rect> = new Map();

    private crossBlockSelection = false;
    private captureSelection = false;
    private startPositionNodeId: string | null = null;
    private startPosition: Point = [0, 0]
    private currentPosition: Point = [0, 0];

    set selectedNodes(value: Set<string>) {
        this._selectedBlocks = value;
        this.emit('selectionChanged', { type: selectionChangedEvent });
    }

    get selectedNodes() {
        return this._selectedBlocks;
    }

    set nodesRects(rects: Map<string, Rect>) {
        this._nodesRects = rects;
        this._blocksRects = new Map<string, Rect>(this._nodesRects);

        for (const id of this._blocksRects.keys()) {
            const node = findById(this.editor.state, id)!;

            if (node.view !== 'block' || node.kind === 'root-node') {
                this._blocksRects.delete(id);
            }
        }
    }
    
    get x(): number {
        if (this.currentPosition[0] < this.startPosition[0]) {
            return this.currentPosition[0] - 1
        }

        return this.startPosition[0] + 1;
    }

    get y(): number {
        if (this.currentPosition[1] < this.startPosition[1]) {
            return this.currentPosition[1] - 1
        }

        return this.startPosition[1] + 1;
    }

    get w(): number {
        if (this.currentPosition[0] < this.startPosition[0]) {
            return this.startPosition[0] - this.currentPosition[0]
        }
        
        return this.currentPosition[0] - this.startPosition[0];
    }

    get h(): number {
        if (this.currentPosition[1] < this.startPosition[1]) {
            return this.startPosition[1] - this.currentPosition[1]
        }
        
        return this.currentPosition[1] - this.startPosition[1];
    }

    get selectionRect(): Rect {
        return [this.x, this.y, this.w, this.h]
    }

    get isCrossBlockSelection(): boolean {
        return this.crossBlockSelection;
    }

    isNodeSelected(id: string) {
        return this.selectedNodes.has(id);
    }

    onMouseDown(p: Point) {
        const tracedBlocks = traceNodes(p, this._blocksRects, this.editor.state).reverse();
        this.startPositionNodeId = tracedBlocks[0];
        this.captureSelection = true;
        this.startPosition = p;
        this.currentPosition = p;

        // Reset selection that was made previously
        this.selectedNodes = new Set();

        if (!this.startPositionNodeId) {
            this.crossBlockSelection = true;
            return;
        }

        const startPositionNode = findById(this.editor.state, this.startPositionNodeId!)!;
        if (startPositionNode.type === 'group' && !startPositionNode.children.some(child => child.kind === 'text-node')) {
            this.crossBlockSelection = true;
        }
    }

    onMouseUp(p: Point) {
        this.captureSelection = false;
        this.crossBlockSelection = false;
        this.startPositionNodeId = null;
        this.startPosition = [0, 0];
        this.currentPosition = [0, 0];

        this.emit('selectionRectChanged', { type: selectionRectChangedEvent })
    }

    onMouseMove(p: Point) {
        if (!this.captureSelection) {
            return;
        }

        this.currentPosition = p;
        this.emit('selectionRectChanged', { type: selectionRectChangedEvent })

        if (this.crossBlockSelection) {
            this.selectedNodes = this.getSelectedNodes();
            return;
        }

        const startPositionNodeRect = this._nodesRects.get(this.startPositionNodeId!)!;

        if (!isPointInRect(p, startPositionNodeRect)) {
            // TODO: fix selection
            const selection = document.getSelection();

            if (selection && !selection.isCollapsed) {
                selection.collapseToStart();
            }

            this.crossBlockSelection = true;
        }
    }

    private getSelectedNodes() {
        const result: Set<string> = new Set();

        for (const [id, rect] of this._blocksRects) {
            const hasIntersection = isRectIntersects(this.selectionRect, rect);
            const rectContainsSelection = isRectContains(rect, this.selectionRect);
            const isStartPositionNode = id === this.startPositionNodeId;
            const startPositionNode = findById(this.editor.state, this.startPositionNodeId!)!;

            if (hasIntersection && !rectContainsSelection || (isStartPositionNode && startPositionNode.type !== 'group')) {
                result.add(id);
            }
        }

        for (const id1 of result) {
            const node1 = findById(this.editor.state, id1)!;

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
}
