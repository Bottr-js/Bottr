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

      // FIXME: Move out into another function
      var session = {
        user: "1", // Object ?
        conversation: "1", // Object ?
        account: "1", // Object ?
        send: function(text) {

          request({
            uri: callbackURI,
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: text
            })
          }, function(error, response, body) {
            console.log(body);
          });

          console.log('Sending "' + text + '"')
        }
      }

      bot.trigger('message_received', body, session)
      res.success();
    })
  }
}

module.exports = WebhookClient
