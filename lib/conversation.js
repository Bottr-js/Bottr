function Conversation(session) {
  this.session = session
}

Conversation.prototype.ask = function(text) {
  this.session.send(text)
}

module.exports = Conversation
