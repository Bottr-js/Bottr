var request = require('request')

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
        client.handleEvent(bot, req, res)
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

FacebookMessengerClient.prototype.handleEvent = function(bot, req, res) {

  var client = this
  var body = req.body

  if (body.object == 'page') {

    body.entry.forEach(function(pageEntry) {
      
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          client.receivedAuthentication(bot, messagingEvent);
        } else if (messagingEvent.message) {
          client.receivedMessage(bot, messagingEvent);
        } else if (messagingEvent.delivery) {
          client.receivedDeliveryConfirmation(bot, messagingEvent);
        } else if (messagingEvent.postback) {
          client.receivedPostback(bot, messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });

    });

  }

  res.sendStatus(200);
}


FacebookMessengerClient.prototype.receivedAuthentication = function(event) {
  console.log('Handle Auth')
}

FacebookMessengerClient.prototype.receivedMessage = function(bot, event) {
  console.log('Handle Message')

  var senderID = event.sender.id;
  var message = event.message;

  // FIXME: Move out into another function
  // FIXME: Reduce this boilerplate / make smaller
  var session = {
    user: senderID, // Object ?
    conversation: senderID, // Object ?
    account: senderID, // Object ?
    send: function(text) {



        var messageData = {
        recipient: {
          id: senderID
        },
        message: {
          text: text
        }
      };

      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: 'howdy' },
        method: 'POST',
        json: messageData

      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;

          console.log("Successfully sent generic message with id %s to recipient %s",
            messageId, recipientId);
        } else {
          console.error("Unable to send message.");
          console.error(response);
          console.error(error);
        }
      });

      console.log('Sending "' + text + '"')
    }
  }

  bot.trigger('message_received', message, session)
}

FacebookMessengerClient.prototype.receivedDeliveryConfirmation = function(event) {
  console.log('Handle Delivery')
}

FacebookMessengerClient.prototype.receivedPostback = function(event) {
  console.log('Handle Postback')
}

module.exports = FacebookMessengerClient
