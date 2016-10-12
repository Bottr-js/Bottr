var Bot = require('./bot')
var WebsocketClient = require('./websocket-client')

function Server() {
  this.namespaces = {}
}

Server.prototype.use = function(namespace_or_bot, bot) {
  if (bot) {
    this.namespaces[namespace_or_bot] = bot
  } else {
    this.namespaces['/'] = namespace_or_bot
  }
}

Server.prototype.listen = function(port) {

  var app = require('express')()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)

  server.listen(port)

  for (var path in this.namespaces) {
    var bot = this.namespaces[path]
    bot.use(new WebsocketClient(io.of(path)))
    app.use(path, bot.router)
  }

  return server
}

Bot.prototype.connectToSocket = function(io) {

  var bot = this

  io.on('connection', function (socket) {

    console.log('new websocket connection')

    socket.on('message', function(data) {

      var session = {
        user: data.user,
        conversation: data.user,
        account: data.user,
        send: function(text) {

          socket.emit('message', {
            text: text
          })
        }
      }

      bot.trigger('message_received', data, session)
    })
  })
}

module.exports = Server
