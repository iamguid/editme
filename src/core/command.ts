import { Editor } from "./editor";
import { TreeNode } from "./tree";

export type Command = (editor: Editor) => TreeNode