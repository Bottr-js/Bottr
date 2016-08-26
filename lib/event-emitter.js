function EventEmitter() {
  this.listeners = []
}

EventEmitter.prototype.addListener = function(event, handler) {
  this.listeners.push({
    event: event,
    handler: handler
  })
}

EventEmitter.prototype.emit = function(event) {
  var args = Array.prototype.concat.apply([], arguments).slice(1)
  var eventListeners = this.listeners.filter(function(listener) {
    return listener.event === event
  })

  eventListeners.forEach(function(listener) {
    listener.handler.apply(this, args)
  })
}

module.exports = EventEmitter
