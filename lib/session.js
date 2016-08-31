function Session(meta, client) {
  this.meta = meta
  this.client = client
}

Session.prototype.send = function(text) {
  this.client.send(this.meta, text)
}

Session.prototype.startTyping = function() {
  this.client.startTyping(this.meta)
}

module.exports = Session
