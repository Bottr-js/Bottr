var Event = require('./event')

function EventEmitter() {
  this.listeners = []
  this.fallbacks = {}
}

EventEmitter.prototype.addListener = function(eventName, handler) {
  this.listeners.push({
    eventName: eventName,
    handler: handler
  })
}

EventEmitter.prototype.fallback = function(eventName, handler) {
  this.fallbacks[eventName] = handler
}

EventEmitter.prototype.emit = function(eventName) {
  var emitter = this
  var args = Array.prototype.concat.apply([], arguments).slice(1)
  var eventListeners = this.listeners.filter(function(listener) {
    return listener.eventName === eventName
  }).map(function(listener) {
    return listener.handler
  })

  var event = new Event(eventName, eventListeners, args)
  event.next(function(eventName) {

    var handler = emitter.unhandledHandlers[eventName]

    if (handler) {
      handler.apply(this, args)
    } else {
      console.error('Unhandled event ' + eventName);
    }
  })

  return event
}

module.exports = EventEmitter
