function Event(eventName, remainingListeners, args) {
  this.eventName = eventName
  this.remainingListeners = remainingListeners
  this.args = args
}

Event.prototype.next = function() {
  if (this.remainingListeners.length > 0) {

    var triggerNext = function() {
      this.next()
    }

    var listener = this.remainingListeners.shift()
    var appliedArgs = Array.prototype.concat.apply(this.args, [triggerNext.bind(this)])
    
    listener.handler.apply(this, appliedArgs)
  }
}

module.exports = Event
