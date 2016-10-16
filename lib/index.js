const Bot = require('./bot')
const Clients = require('./clients')
const Server = require('./server')

const FacebookMessengerClient = Clients.FacebookMessengerClient
const TwilioClient = Clients.TwilioClient
const TwitterClient = Clients.TwitterClient
const WebsocketClient = Clients.WebsocketClient

require('./listen')

module.exports = {
  Bot,
  Clients,
  Server,

  // Clients
  FacebookMessengerClient,
  TwilioClient,
  TwitterClient,
  WebsocketClient,
}
