function WebhookClient() {
  return function(bot) {
    bot.on('webhook', function(event, req, res) {
      console.log('webhook will be handled here');

      var body = req.body

      if (body.text) {
        res.success();
      } else {
        res.error("You need to provide text for the message.");
      }
    })
  }
}

module.exports = WebhookClient
