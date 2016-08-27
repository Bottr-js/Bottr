var FacebookMessengerClient = require('./facebook-messenger-client');
var WebhookClient = require('./webhook-client');
var MemoryStorage = require('./memory-storage');
var Bot = require('./bot')
var Server = require('./server')

Bot.prototype.listen = function() {
  var server = Server()
  server.use(this.router)
  server.listen(this.config.port)
}

module.exports = {
  Bot: Bot,
  WebhookClient: WebhookClient,
  FacebookMessengerClient: FacebookMessengerClient,
  MemoryStorage: MemoryStorage,
  Server: Server
}
