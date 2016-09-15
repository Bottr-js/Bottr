var queue = require('queue');

function Session(user, client) {
  this.queue = queue()
  this.queue.concurrency = 1

  this.user = user
  this.client = client
}

Session.prototype.send = function(text, attachment) {

  var session = this

  this.queue.push(function(cb) {
    session.startTyping()

    if (text) {
      var averageWordsPerMinute = 600
      var averageWordsPerSecond = averageWordsPerMinute / 60
      var averageWordsPerMillisecond = averageWordsPerSecond / 1000
      var totalWords = text.split(" ").length
      var typingTime = totalWords / averageWordsPerMillisecond
    } else {
      var typingTime = 0
    }

    setTimeout(function() {
      session.client.send(session, text, attachment)
      cb()
    }, typingTime)
  });

  this.queue.start()
}

Session.prototype.startTyping = function() {
  this.client.startTyping(this)
}

module.exports = Session
