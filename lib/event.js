class Event {
  constructor(remainingListeners, args) {
    this.remainingListeners = remainingListeners;
    this.args = args;
  }

  next(catchUnhandled) {
    if (this.remainingListeners.length > 0) {
      const triggerNext = () => {
        this.next(catchUnhandled);
      };

      const listener = this.remainingListeners.shift();
      const appliedArgs = [...this.args, triggerNext.bind(this)];

      listener(...appliedArgs);
    } else {
      catchUnhandled();
    }
  }
}

module.exports = Event;
