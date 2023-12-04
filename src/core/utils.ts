import { TemplateResult } from "lit";
import { GroupNode, TreeNode, findById } from "./tree";

export type Rect = [number, number, number, number]; 
export type Point = [number, number]; 

export const randomUUID = (): string => {
    // desired length of Id
    const idStrLen = 32;
    // always start with a letter -- base 36 makes for a nice shortcut
    let idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
    // add a timestamp in milliseconds (base 36 again) as the base
    idStr += (new Date()).getTime().toString(36) + "_";
    // similar to above, complete the Id using random, alphanumeric characters
    do {
        idStr += (Math.floor((Math.random() * 35))).toString(36);
    } while (idStr.length < idStrLen);

    return (idStr);
}

export const findNearestParentTreeNode = (tree: TreeNode, element: HTMLElement): TreeNode | null => {
    let currentElement: HTMLElement | Node | null = element;

    while (currentElement !== null) {
        if (currentElement instanceof HTMLElement) {
            const nodeId = currentElement.getAttribute('data-node');

            if (nodeId !== null && nodeId !== undefined && nodeId !== '') {
                return findById(tree, nodeId);
            }
        }

        currentElement = currentElement.parentElement;
    }

    return null;
}

export const templateAsString = (data: TemplateResult): string => {
    const {strings, values} = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueList: any[] = [...values, ''];  // + last empty part
    let output = '';
    for (let i = 0; i < strings.length; i++) {
        let v = valueList[i];
        if (v._$litType$ !== undefined) {
            v = templateAsString(v);  // embedded Template
        } else if (v instanceof Array) {
            // array of strings or templates.
            let new_v = '';
            for (const inner_v of [...v]) {
                new_v += templateAsString(inner_v);
            }
            v = new_v;
        }
        output += strings[i] + v;
    }
    return output;
}

// @see https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
export const stringHash = (str: string) => {
    let hash = 0;
     
    if (str.length == 0) return hash;
     
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
     
    return hash;
}

export const traceNodes = (p: Point, rects: Map<string, Rect>, root: GroupNode): string[] => {
    const result: string[] = [];

    for (const [id, rect] of rects) {
        if (isPointInRect(p, rect)) {
            result.push(id);
        }
    }

    result.sort((a, b) => {
        if (a === b) {
            return 0;
        }

        const aNode = findById(root, a) as GroupNode;
        const isAParentOfB = findById(aNode, b) !== null;

        if (isAParentOfB) {
            return -1;
        } else {
            return 1;
        }
    });

    return result;
}

export const getAbsoluteRect = (element: Node): Rect => {
    let w = 0;
    let h = 0;
    let x = 0;
    let y = 0;

    let el: Node | null = element
    let isFound = false;

    while(el) {
        if (el instanceof HTMLElement) {
            if (!isFound) {
                w = el.clientWidth;
                h = el.clientWidth;
                isFound = true;
            }

            x += el.offsetLeft ?? 0;
            y += el.offsetTop ?? 0;
            el = el.offsetParent;
        } else {
            el = el.parentElement;
        }
    }

    return [x, y, w, h];
}

export const isRectIntersects = (rect1: Rect, rect2: Rect): boolean => {
    return rect1[0] < rect2[0] + rect2[2] &&
        rect1[0] + rect1[2] > rect2[0] &&
        rect1[1] < rect2[1] + rect2[3] &&
        rect1[1] + rect1[3] > rect2[1];
}

export const isRectContains = (rect1: Rect, rect2: Rect): boolean => {
    return rect1[0] <= rect2[0] &&
        rect1[0] + rect1[2] >= rect2[0] + rect2[2] &&
        rect1[1] <= rect2[1] &&
        rect1[1] + rect1[3] >= rect2[1] + rect2[3];
}

export const isPointInRect = (point: Point, rect: Rect): boolean => {
    return point[0] >= rect[0] &&
        point[0] <= rect[0] + rect[2] &&
        point[1] >= rect[1] &&
        point[1] <= rect[1] + rect[3];
}