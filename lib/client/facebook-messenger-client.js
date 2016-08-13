const Http = require('http')
const MessengerBot = require('messenger-bot')
const assert = require('assert');

function FacebookMessengerClient(config) {

  assert(config.pageAccessToken, "Config doesn't contain page access token")
  assert(config.validationSecret, "Config doesn't contain validation secret")
  assert(config.appSecret, "Config doesn't contain app secret")

  this.messenger = new MessengerBot({
    token: config.pageAccessToken,
    verify: config.validationSecret,
    app_secret: config.appSecret
  })
}

FacebookMessengerClient.prototype.start = function(bot) {

  this.messenger.on('message', (payload, reply) => {
    bot.didRecieveMessage(payload.message.text, { id: payload.sender.id })
  })

  Http.createServer(this.messenger.middleware()).listen(process.env.PORT)
};

FacebookMessengerClient.prototype.speak = function(message, user) {
  this.messenger.sendMessage(user.id, { text: message })
}

module.exports = FacebookMessengerClient;
