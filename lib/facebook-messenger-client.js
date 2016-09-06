var Session = require('./session')
var request = require('request')

function FacebookMessengerClient(bot, config) {

  var defaults = {
    verify_token: process.env.MESSENGER_VERIFY_TOKEN,
    access_token: process.env.MESSENGER_ACCESS_TOKEN
  }

  this.config = Object.assign({}, defaults, config)

  bot.on('webhook', this.createWebhookHandler(bot))
}

FacebookMessengerClient.prototype.createWebhookHandler = function(bot) {
  return function(req, res, next) {

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

    res.success()

  }.bind(this)
}

FacebookMessengerClient.prototype.handleSubscription = function(req, res) {

  var query = req.query

  if (query['hub.verify_token'] === this.config.verify_token) {
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
        if (messagingEvent.message) {
          client.receivedMessage(bot, messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });

    });

  }
}

FacebookMessengerClient.prototype.receivedMessage = function(bot, event) {
  var senderID = event.sender.id
  var message = event.message

  var session = new Session(senderID, {}, this)

  bot.trigger('message_received', message, session)
}

FacebookMessengerClient.prototype.send = function(session, text) {

  console.log('Sending "' + text + '"')

  var messageData = {
    recipient: {
      id: session.user
    },
    message: {
      text: text
    }
  };

  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: this.config.access_token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Successfully sent message.");
    } else {
      console.error("Unable to send message.");
    }
  });
}

FacebookMessengerClient.prototype.startTyping = function(session) {

  var messageData = {
    recipient: {
      id: session.user
    },
    sender_action: "typing_on"
  }

  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: this.config.access_token },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Successfully sent message.");
    } else {
      console.error("Unable to send message.");
    }
  });
}

module.exports = FacebookMessengerClient
