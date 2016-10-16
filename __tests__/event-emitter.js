/* global spyOn */

jest.unmock('../lib/event-emitter')

var EventEmitter = require('../lib/event-emitter')

it('should register listener', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  expect(emitter.listeners).toEqual([
    {
      eventName: 'event',
      handler: handler
    }
  ])
})

it('should register listener', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  expect(emitter.listeners).toEqual([
    {
      eventName: 'event',
      handler: handler
    }
  ])
})

it('should register fallback', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.fallback('event', handler)
  expect(emitter.fallbacks['event']).toEqual(handler)
})

it('should emit event with correct handlers', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()
  var handler2 = jest.fn()

  emitter.addListener('event', handler)
  emitter.addListener('event2', handler2)
  var event = emitter.emit('event')

  expect(event.remainingListeners).toEqual([handler])
})

it('should emit event with correct arguments', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  var event = emitter.emit('event', 1)

  expect(event.args).toEqual([
    1
  ])
})

it('should use fallback for event with no handlers', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.fallback('event', handler)
  var event = emitter.emit('event')

  expect(handler).toBeCalled()
})

it('should log error for event with no handlers or fallback', () => {

  jest.mock('console')

  var emitter = new EventEmitter()
  var handler = jest.fn()

  var spy = spyOn(console, 'error')
  var event = emitter.emit('event')

  expect(spy).toBeCalled()
})
