function Session(meta, client) {
  this.meta = meta
  this.client = client
  this.typingCounter = 0
}

Session.prototype.send = function(text) {
  this.client.send(this.meta, text)
}

Session.prototype.incrementTypingCount = function() {

  if (this.typingCounter === 0) {
    // Trigger client to start typing
  }

  this.typingCounter ++
}

Session.prototype.decrementTypingCount = function() {

  if (this.typingCounter > 0) {
    this.typingCounter --
  }

  if (this.typingCounter === 0) {
    // Trigger client to stop typing
  }
}

module.exports = Session
