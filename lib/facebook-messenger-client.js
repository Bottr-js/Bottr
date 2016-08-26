function FacebookMessengerClient() {

  var client = this

  return function(bot) {
    bot.on('webhook', function(req, res, next) {

      // If this isn't a facebook request then carry on with other handlers
      if ( !req.headers.hasOwnProperty('x-hub-signature') && req.headers['user-agent'].indexOf('facebookplatform') === -1) {
        next()
        return
      }

      var query = req.query

      if ( query['hub.mode'] === 'subscribe') {
        client.handleSubscription(req, res)
      } else {
        client.handleEvent(req, res)
      }
    })
  }
}

  // FIXME: Allow token to be configured
FacebookMessengerClient.prototype.handleSubscription = function(req, res) {

  var query = req.query

  if (query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(query['hub.challenge'])
  } else {
    res.send('Error, wrong token');
  }
}

FacebookMessengerClient.prototype.handleEvent = function(req, res) {
  res.success()
}

module.exports = FacebookMessengerClient
