export type Payload = { type: Symbol }
export type EventBusHandler<TPayload extends Payload> = (payload: TPayload) => void
export type EventBusProtocol<TPayload extends Payload = Payload> = Record<string | symbol | number, TPayload>
export type EventBusHandlersMap<TProtocol extends EventBusProtocol, TPayload extends Payload = Payload> = Record<keyof TProtocol, EventBusHandler<TPayload>[]>

export interface IEventBus<TProtocol extends EventBusProtocol> {
    on<key extends keyof TProtocol>(key: key, handler: EventBusHandler<TProtocol[key]>): () => void
    off<key extends keyof TProtocol>(key: key, handler: EventBusHandler<TProtocol[key]>): void
    once<key extends keyof TProtocol>(key: key, handler: EventBusHandler<TProtocol[key]>): void
    emit<key extends keyof TProtocol>(key: key, payload: TProtocol[key]): void
}

export class EventBus<TProtocol extends EventBusProtocol> implements IEventBus<TProtocol> {
    private bus: Partial<EventBusHandlersMap<TProtocol, any>> = {}

    on<TKey extends keyof TProtocol>(key: TKey, handler: EventBusHandler<TProtocol[TKey]>): () => void {
        if (this.bus[key] === undefined) {
            this.bus[key] = []
        }

        this.bus[key]!.push(handler)

        return () => {
            this.off(key, handler)
        }
    }

    off<TKey extends keyof TProtocol>(key: TKey, handler: EventBusHandler<TProtocol[TKey]>): void {
        const index = this.bus[key]?.indexOf(handler) ?? -1
        this.bus[key]?.splice(index >>> 0, 1)
    }

    once<TKey extends keyof TProtocol>(key: TKey, handler: EventBusHandler<TProtocol[TKey]>): void {
        const handleOnce = (payload: any) => {
            handler(payload)
            this.off(key, handleOnce)
        }

        this.on(key, handleOnce)
    }

    emit<TKey extends keyof TProtocol>(key: TKey, payload: TProtocol[TKey]): void {
        this.bus[key]?.forEach((fn) => {
            fn(payload)
        })
    }
}