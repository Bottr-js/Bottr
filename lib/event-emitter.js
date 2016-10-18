const Event = require('./event');

class EventEmitter {
  constructor() {
    this.listeners = [];
    this.fallbacks = {};
  }

  addListener(eventName, handler) {
    this.listeners.push({
      eventName,
      handler,
    });
  }

  fallback(eventName, handler) {
    this.fallbacks[eventName] = handler;
  }

  emit(eventName, ...args) {
    const eventListeners = this.listeners.filter(listener =>
      listener.eventName === eventName
    ).map(listener =>
      listener.handler
    );

    const event = new Event(eventListeners, args);
    event.next(() => {
      const handler = this.fallbacks[eventName];

      if (handler) {
        handler.apply(this, args);
      } else {
        console.error(`Unhandled event ${eventName}`);
      }
    });

    return event;
  }
}

module.exports = EventEmitter;
