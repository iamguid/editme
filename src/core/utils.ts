import { TemplateResult } from "lit";
import { TreeNode, findById } from "./tree";

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
    let currentElement: HTMLElement | null = element;

    while (currentElement !== null) {
        const nodeId = currentElement.getAttribute('data-node');

        if (nodeId !== null && nodeId !== undefined && nodeId !== '') {
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