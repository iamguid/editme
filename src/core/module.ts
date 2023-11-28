import { Editor } from "./editor";
import { EventBus, EventBusProtocol } from "./event-bus";
import { GroupNode } from "./tree";

export abstract class AbstractModule<TProtocol extends EventBusProtocol> extends EventBus<TProtocol> {
    constructor(protected editor: Editor) {
        super();
    }

    processState(state: GroupNode) {
        return state;
    }
}