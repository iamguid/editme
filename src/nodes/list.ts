import { TokenNode } from "../core/tree";

export enum ListType {
    ORDERED,
    UNORDERED,
}

export interface ListNode extends TokenNode {
    list: ListType
}