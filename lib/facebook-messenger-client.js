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
    res.sendStatus(403)
  }
}

FacebookMessengerClient.prototype.handleEvent = function(req, res) {

  var body = req.body

  // Make sure this is a page subscription
  if (body.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    body.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Facebook Messenger Client received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
  }

  // Assume all went well.
  //
  // You must send back a 200, within 20 seconds, to let us know you've
  // successfully received the callback. Otherwise, the request will time out.
  res.sendStatus(200);
}

module.exports = FacebookMessengerClient
