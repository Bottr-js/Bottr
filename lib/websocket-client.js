var Session = require('./session')

function WebsocketClient() {

  var client = this

  return function(bot) {

    bot.connectToSocket = function(io) {
      var bot = this

      io.on('connection',  function (socket) {

        console.log('new websocket connection')

        socket.on('message', function(data) {

          var session = new Session({
            user: data.user,
            conversation: data.user,
            account: data.user,
            socket: socket
          }, client)

          bot.trigger('message_received', data, session)
        })
      });
    }
  }
}

WebsocketClient.prototype.send = function(meta, text) {
  meta.socket.emit('message', {
    text: text
  })
}

WebsocketClient.prototype.startTyping = function(meta) {
  meta.socket.emit('typing', {})
}

module.exports = WebsocketClient
