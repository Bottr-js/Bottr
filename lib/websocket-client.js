var Session = require('./session')

function WebsocketClient(io) {
  io.on('connection', this.onConnection.bind(this))
}

WebsocketClient.prototype.onConnection = function(socket) {
    console.debug('new websocket connection')

    socket.on('message', function(data) {
      
      var session = new Session(data.user, {}, this)
      session.socket = socket

      bot.trigger('message_received', data, session)

    }.bind(this))
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
