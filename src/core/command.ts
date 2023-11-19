import { Editor } from "./editor";
import { GroupNode } from "./tree";

export type Command = (editor: Editor) => GroupNode