var Event = require('./event')

function EventEmitter() {
  this.listeners = []
}

EventEmitter.prototype.addListener = function(eventName, handler) {
  this.listeners.push({
    eventName: eventName,
    handler: handler
  })
}

EventEmitter.prototype.emit = function(eventName) {
  var args = Array.prototype.concat.apply([], arguments).slice(1)
  var eventListeners = this.listeners.filter(function(listener) {
    return listener.eventName === eventName
  })

  var event = new Event(eventName, eventListeners, args)
  event.next()
}

module.exports = EventEmitter
