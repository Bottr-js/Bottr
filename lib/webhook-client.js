function WebhookClient() {
  return function(bot) {
    bot.on('webhook', function(req, res, next) {
      var body = req.body

      if (body.text) {
        bot.trigger('message_received')
        res.success();
      } else {
        res.error("You need to provide text for the message.");
      }
    })
  }
}

module.exports = WebhookClient
