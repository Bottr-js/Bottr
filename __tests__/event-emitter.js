jest.unmock('../lib/event-emitter')

var EventEmitter = require('../lib/event-emitter')

test('should register listener', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  expect(emitter.listeners).toEqual([
    {
      eventName: 'event',
      handler: handler
    }
  ])
});

test('should register listener', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  expect(emitter.listeners).toEqual([
    {
      eventName: 'event',
      handler: handler
    }
  ])
});

test('should register fallback', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.fallback('event', handler)
  expect(emitter.fallbacks['event']).toEqual(handler)
});

// EventEmitter.prototype.emit = function(eventName) {
//   var event = new Event(eventName, eventListeners, args)
//   event.next(function(eventName) {
//
//     var handler = emitter.unhandledHandlers[eventName]
//
//     if (handler) {
//       handler.apply(this, args)
//     } else {
//       console.error('Unhandled event ' + eventName);
//     }
//   })
// }
//

test('should emit event', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  var event = emitter.emit('event')

  expect(event.eventName).toEqual('event')
});

test('should emit event with correct handlers', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()
  var handler2 = jest.fn()

  emitter.addListener('event', handler)
  emitter.addListener('event2', handler2)
  var event = emitter.emit('event')

  expect(event.remainingListeners).toEqual([handler])
});

test('should emit event with correct arguments', () => {
  var emitter = new EventEmitter()
  var handler = jest.fn()

  emitter.addListener('event', handler)
  var event = emitter.emit('event', 1)

  expect(event.args).toEqual([
    1,
    jest.fn()
  ])
});
//
// test('should use fallback for event with no handlers', () => {
//   var emitter = new EventEmitter()
//   var handler = jest.fn()
//
//   emitter.fallback('event', handler)
//   expect(emitter.fallbacks['event']).toEqual(handler)
// });
//
// test('should log error for event with no handlers or fallback', () => {
//   var emitter = new EventEmitter()
//   var handler = jest.fn()
//
//   emitter.fallback('event', handler)
//   expect(emitter.fallbacks['event']).toEqual(handler)
// });
