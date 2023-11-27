import { TemplateResult } from "lit";
import { TreeNode, findById } from "./core/tree";

export const findNearestParentTreeNode = (tree: TreeNode, element: HTMLElement): TreeNode | null => {
    let currentElement: HTMLElement | null = element;

    while (currentElement !== null) {
        const nodeId = currentElement.id;

        if (nodeId !== undefined) {
            return findById(tree, nodeId);
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
