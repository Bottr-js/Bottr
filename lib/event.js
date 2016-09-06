function Event(eventName, remainingListeners, args) {
  this.eventName = eventName
  this.remainingListeners = remainingListeners
  this.args = args
}

Event.prototype.next = function(catchUnhandled) {
  if (this.remainingListeners.length > 0) {

    var triggerNext = function() {
      this.next(catchUnhandled)
    }

    var listener = this.remainingListeners.shift()
    var appliedArgs = Array.prototype.concat.apply(this.args, [triggerNext.bind(this)])

    listener.apply(this, appliedArgs)
  } else {
    catchUnhandled(this.eventName)
  }
}

module.exports = Event
