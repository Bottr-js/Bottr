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
//   var emitter = this
//   var args = Array.prototype.concat.apply([], arguments).slice(1)
//   var eventListeners = this.listeners.filter(function(listener) {
//     return listener.eventName === eventName
//   })
//
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
