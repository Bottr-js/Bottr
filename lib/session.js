function Session(meta, client) {
  this.meta = meta
  this.client = client
}

Session.prototype.send = function(text) {

  // Implement queue for more realistic typing so mutiple messages are
  // typing -> text -> typing -> text
  // not
  // typing -> text -> text
  this.startTyping()

  var session = this

  setTimeout(function() {
    session.client.send(session.meta, text)
  }, 1000) // Timeout should be based on average WPM typing
}

Session.prototype.startTyping = function() {
  this.client.startTyping(this.meta)
}

module.exports = Session
