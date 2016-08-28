var Bot = require('./bot')
var FacebookMessengerClient = require('./facebook-messenger-client')
var MemoryStorage = require('./memory-storage')
var Server = require('./server')
var TwillioClient = require('./twillio-client')
var TwitterClient = require('./twitter-client')
var WebhookClient = require('./webhook-client')

Bot.prototype.listen = function() {
  var server = Server()
  server.use(this.router)
  server.listen(this.config.port)
}

module.exports = {
  Bot: Bot,
  FacebookMessengerClient: FacebookMessengerClient,
  MemoryStorage: MemoryStorage,
  Server: Server,
  TwillioClient: TwillioClient,
  TwitterClient: TwitterClient,
  WebhookClient: WebhookClient
}
