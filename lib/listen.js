var Server = require('./server')
var Bot = require('./bot')

Bot.prototype.listen = function(port) {
  var serverPort = port || process.env.PORT || 3000
  var server = new Server()
  server.use(this)
  server.listen(serverPort)
  console.log('Bot is listening on port ' + serverPort)
}
