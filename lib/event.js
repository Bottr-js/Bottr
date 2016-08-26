function Event(eventName, remainingListeners, args) {
  this.eventName = eventName
  this.remainingListeners = remainingListeners
  this.args = args
}

Event.prototype.next = function() {
  if (this.remainingListeners.length > 0) {
    var listener = this.remainingListeners.shift()
    listener.handler.apply(this, this.args)
  }
}

module.exports = Event
