var Session = require('./session')
var request = require('request')

function FacebookMessengerClient(config) {
  return function(bot) {
    var defaults = {
      verify_token: process.env.MESSENGER_VERIFY_TOKEN,
      access_token: process.env.MESSENGER_ACCESS_TOKEN,
      graph_uri: 'https://graph.facebook.com',
    }

    this.bot = bot
    this.config = Object.assign({}, defaults, config)

    this.bot.on('webhook', this.createWebhookHandler())

    return this

  }.bind(this)
}

FacebookMessengerClient.prototype.createWebhookHandler = function() {
  return function(req, res, next) {

    // If this isn't a facebook request then carry on with other handlers
    if ( !req.headers.hasOwnProperty('x-hub-signature') && req.headers['user-agent'].indexOf('facebookplatform') === -1) {
      next()
      return
    }

    var query = req.query

    if ( query['hub.mode'] === 'subscribe') {
      this.handleSubscription(req, res)
    } else {
      this.handleEvent(this.bot, req, res)
    }

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

    res.status(200)

    body.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(messagingEvent) {

        if (messagingEvent.message) {
          client.receivedMessage(bot, messagingEvent)
        } else {
          console.error('Webhook received unknown messagingEvent: ', messagingEvent)
          res.status(400)
        }

      })
    })

    res.end()

  } else {
    res.sendStatus(400)
  }
}

FacebookMessengerClient.prototype.receivedMessage = function(bot, event) {
  var senderID = event.sender.id
  var message = event.message

  var session = new Session(bot, senderID, this)

  bot.trigger('message_received', message, session)

  return session
}

FacebookMessengerClient.prototype.send = function(session, text, attachment) {

  console.log('Sending "' + text + '"')

  var messageData = {
    recipient: {
      id: session.user
    },
    message: {}
  }

  if (text) {
    messageData.message.text = text
  }

  if (attachment) {
    messageData.message.attachment = {
      type: attachment.type,
      url: attachment.url
    }
  }

  return request({
    uri: this.config.graph_uri+'/v2.6/me/messages',
    qs: { access_token: this.config.access_token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Successfully sent message.')
    } else {
      console.error('Unable to send message.')
    }
  })
}

FacebookMessengerClient.prototype.startTyping = function(session) {

  var messageData = {
    recipient: {
      id: session.user
    },
    sender_action: 'typing_on'
  }

  return request({
    uri: this.config.graph_uri+'/v2.6/me/messages',
    qs: { access_token: this.config.access_token },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Successfully started typing indicator.')
    } else {
      console.error('Unable to start typing indicator.')
    }
  })
}

module.exports = FacebookMessengerClient
