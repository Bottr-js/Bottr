var EventEmitter = require('./event-emitter')
var Matchers = require('./matchers')

function Topic() {
  this.eventEmitter = new EventEmitter()

  this.eventEmitter.addListener('message_received', function(message, session, next) {
    session.startTyping()
    next()
  })

  this.eventEmitter.fallback('message_received', function(message, session) {
    session.send("Sorry my creator didn't teach me anything else")
  })
}

Topic.prototype.trigger = function(eventName) {
  console.log(eventName +' event triggered for topic')
  this.eventEmitter.emit.apply(this.eventEmitter, arguments)
}

Topic.prototype.on = function(eventName, handler) {
  this.eventEmitter.addListener(eventName, handler)
}

Topic.prototype.hears = function(pattern, handler) {

  var matcher = pattern

  if (pattern instanceof Array) {
    matcher = new Matchers.ArrayMatcher(pattern)
  } else if (pattern instanceof String) {
    matcher = new Matchers.StringMatcher(pattern)
  } else if(pattern instanceof RegExp) {
    matcher = new Matchers.RegExpMatcher(pattern)
  }

  this.on('message_received', function(message, session, next) {
    if (matcher(message)) {
      handler(message, session)
    } else {
      next()
    }
  })
}

module.exports = Topic
