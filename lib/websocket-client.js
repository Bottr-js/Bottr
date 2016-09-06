var Session = require('./session')

function WebsocketClient(bot, io) {
  this.bot = bot
  io.on('connection', this.createConnectionHandler())
}

WebsocketClient.prototype.createConnectionHandler = function() {
  return function(socket) {
    console.log('new websocket connection')
    socket.on('message', this.createMessageHandler(socket))
  }.bind(this)
}

WebsocketClient.prototype.createMessageHandler = function(socket) {
  return function(data) {

    var session = new Session(data.user, {}, this)
    session.socket = socket

    this.bot.trigger('message_received', data, session)

    return session

  }.bind(this)
}

WebsocketClient.prototype.send = function(session, text) {
  session.socket.emit('message', {
    text: text
  })
}

WebsocketClient.prototype.startTyping = function(session) {
  session.socket.emit('typing', {})
}

module.exports = WebsocketClient
