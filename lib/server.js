var Bot = require('./bot')

function Server(config) {
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

    app.get(path, function (req, res) {
      res.sendFile(__dirname + '/../node_modules/Pozi-Webclient/index.html');
    });

    var bot = this.namespaces[path]
    app.use(path, bot.router)
    bot.connectToSocket(io.of(path))
  }
}

module.exports = Server
