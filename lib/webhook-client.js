function WebhookClient() {
  return function(bot) {
    bot.on('webhook', function(event, req, res) {
      console.log('webhook will be handled here');
      res.send({});
      event.next();
    })
  }
}

module.exports = WebhookClient
