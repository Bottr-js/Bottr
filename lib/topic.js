const EventEmitter = require('./event-emitter');
const Matchers = require('./matchers');

class Topic {
  constructor() {
    this.eventEmitter = new EventEmitter();

    this.eventEmitter.addListener('message_received', (message, session, next) => {
      session.startTyping();
      next();
    });

    this.eventEmitter.fallback('message_received', (message, session) => {
      session.send('Sorry my creator didn\'t teach me anything else');
    });
  }

  trigger(eventName, ...args) {
    console.log(`${eventName} event triggered for topic`);
    this.eventEmitter.emit(eventName, ...args);
  }

  on(eventName, handler) {
    this.eventEmitter.addListener(eventName, handler);
  }

  hears(pattern, handler) {
    let matcher = pattern;

    if (pattern instanceof Array) {
      matcher = new Matchers.ArrayMatcher(pattern);
    } else if (pattern instanceof String) {
      matcher = new Matchers.StringMatcher(pattern);
    } else if (pattern instanceof RegExp) {
      matcher = new Matchers.RegExpMatcher(pattern);
    }

    this.on('message_received', (message, session, next) => {
      if (matcher(message)) {
        handler(message, session);
      } else {
        next();
      }
    });
  }
}

module.exports = Topic;
