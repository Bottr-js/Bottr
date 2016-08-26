function WebhookClient() {
  return function(bot) {
    bot.on('webhook', function(req, res, next) {
      var body = req.body

      if (body.text) {

        // - Generate Message Object
        var session = {
          send: function(text) {
            console.log(text)
          }
        }

        bot.trigger('message_received', body, session)
        res.success();
      } else {
        res.error("You need to provide text for the message.");
      }
    })
  }
}

module.exports = WebhookClient
