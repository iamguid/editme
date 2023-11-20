import { expect, assert } from 'chai'
import { fake } from 'sinon'
import { EventBus } from "./event-bus";

const testTypeSymbol = Symbol('test');

type TestProtocol = {
    'test': { type: typeof testTypeSymbol, d: number }
}

describe("event-bus", () => {
    it("EventBus should be created", () => {
        const bus = new EventBus<TestProtocol>()
        expect(bus).to.be.instanceOf(EventBus)
    })

    it("emit on empty event bus should do nothing", () => {
        const bus = new EventBus<TestProtocol>()
        expect(() => bus.emit('test', { type: testTypeSymbol, d: 42 })).not.throw()
    })

    it("emit after on should emit event", () => {
        const bus = new EventBus<TestProtocol>()

        const fn = fake();
        bus.on('test', fn)
        bus.emit('test', { type: testTypeSymbol, d: 42 })

        assert(fn.calledOnceWith({ type: testTypeSymbol, d: 42 }))
    })

    it("emit after off should do nothing", () => {
        const bus = new EventBus<TestProtocol>()

        const fn = fake();
        bus.on('test', fn)
        bus.emit('test', { type: testTypeSymbol, d: 42 })
        bus.emit('test', { type: testTypeSymbol, d: 43 })
        bus.off('test', fn)
        bus.emit('test', { type: testTypeSymbol, d: 44 })

        assert(fn.calledTwice)
        assert(fn.firstCall.calledWith({ type: testTypeSymbol, d: 42 }))
        assert(fn.secondCall.calledWith({ type: testTypeSymbol, d: 43 }))
    })

    it("once should emit only once time", () => {
        const bus = new EventBus<TestProtocol>()

        const fn = fake();
        bus.once('test', fn)
        bus.emit('test', { type: testTypeSymbol, d: 42 })
        bus.emit('test', { type: testTypeSymbol, d: 43 })

        assert(fn.calledOnceWith({ type: testTypeSymbol, d: 42 }))
    })
})