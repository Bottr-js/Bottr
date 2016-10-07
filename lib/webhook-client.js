var Session = require('./session')
var request = require('request')

function WebhookClient() {
  return function(bot) {
    this.bot = bot
    bot.on('webhook', this.createWebhookHandler(bot))
    return this
  }.bind(this)
}

WebhookClient.prototype.createWebhookHandler = function(bot) {
  return function(req, res, next) {

    var body = req.body
    var callbackURI = req.query.callback;

    if (!callbackURI) {
      res.error('No callback URI parameter provided.');
      return
    }

    if (!body.text) {
      res.error('No text provided in body for the message.');
      return
    }

    var session = new Session(bot, body.user, this)
    session.callbackURI = callbackURI

    bot.trigger('message_received', body, session)
    res.success()

    return session

  }.bind(this)
}

WebhookClient.prototype.send = function(session, text) {
  return request({
    uri: session.callbackURI,
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text
    })
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Successfully sent message.");
    } else {
      console.error("Unable to send message.");
    }
  });
}

WebhookClient.prototype.startTyping = function(session) {
}

module.exports = WebhookClient
