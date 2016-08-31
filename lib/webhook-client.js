var Session = require('./session')
var request = require('request')

function WebhookClient() {
  return function(bot) {
    bot.on('webhook', function(req, res, next) {

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

      var session = new Session({
        user: body.user,
        conversation: body.user,
        account: body.user,
        callbackURI: callbackURI
      }, this)

      bot.trigger('message_received', body, session)
      res.success()
    })
  }
}

WebhookClient.prototype.send = function(meta, text) {
  request({
    uri: meta.callbackURI,
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

module.exports = WebhookClient
