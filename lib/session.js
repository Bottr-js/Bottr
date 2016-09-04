var queue = require('queue');

function Session(meta, client) {
  this.queue = queue()
  this.queue.concurrency = 1

  this.meta = meta
  this.client = client
}

Session.prototype.send = function(text) {

  var session = this

  this.queue.push(function(cb) {
    session.startTyping()
    console.log('send')

    setTimeout(function() {
      session.client.send(session.meta, text)
      cb()
    }, 1000) // Timeout should be based on average WPM typing
  });

    this.queue.start()
}

Session.prototype.startTyping = function() {
  this.client.startTyping(this.meta)
}

module.exports = Session
