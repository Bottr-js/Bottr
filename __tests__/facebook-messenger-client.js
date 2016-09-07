jest.unmock('../lib/facebook-messenger-client')

var Bot = require('../lib/bot')
var FacebookMessengerClient = require('../lib/facebook-messenger-client')

var bot = new Bot()

test('should use enviromental variables for access and verify token', () => {

  process.env.MESSENGER_ACCESS_TOKEN = 'access'
  process.env.MESSENGER_VERIFY_TOKEN = 'verify'

  var client = new FacebookMessengerClient(bot)

  expect(client.config.access_token).toEqual('access')
  expect(client.config.verify_token).toEqual('verify')
  process.env.MESSENGER_ACCESS_TOKEN = undefined
  process.env.MESSENGER_VERIFY_TOKEN = undefined
});

test('should use configuration object for access and verify token', () => {

  var client = new FacebookMessengerClient(bot, {
    access_token: 'access',
    verify_token: 'verify'
  })

  expect(client.config.access_token).toEqual('access')
  expect(client.config.verify_token).toEqual('verify')
});

test('should register for webhook event', () => {

  var handler = jest.fn()

  var handler = jest.fn()

  var originalImp = FacebookMessengerClient.prototype.createWebhookHandler
  FacebookMessengerClient.prototype.createWebhookHandler = function() {
    return handler
  }

  var client = new FacebookMessengerClient(bot)

  expect(bot.on).toBeCalledWith('webhook', handler)
  FacebookMessengerClient.prototype.createWebhookHandler = originalImp
});

test('should ignore webhook with no x-hub-signature', () => {

  var handler = jest.fn()

  var handler = jest.fn()

  var originalImp = FacebookMessengerClient.prototype.createWebhookHandler
  FacebookMessengerClient.prototype.createWebhookHandler = function() {
    return handler
  }

  var client = new FacebookMessengerClient(bot)

  expect(bot.on).toBeCalledWith('webhook', handler)
  FacebookMessengerClient.prototype.createWebhookHandler = originalImp
});

test('should not handle webhook without x-hub-signature and facebook platform user agent', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'Snapchat bro'
    }
  }

  var client = new FacebookMessengerClient(bot)
  client.createWebhookHandler()(req, {}, next)

  expect(next).toBeCalled()
});

test('should respond with challenge for successful subsription', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test',
      'hub.challenge': 'challenge'
    }
  }

  var res = {
    send: jest.fn()
  }

  var client = new FacebookMessengerClient(bot, {
    verify_token: 'test'
  })

  client.createWebhookHandler()(req, res, next)

  expect(res.send).toBeCalledWith('challenge')
});

test('should respond with 403 for failed subsription', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {
      'hub.mode': 'subscribe'
    }
  }

  var res = {
    sendStatus: jest.fn()
  }

  var client = new FacebookMessengerClient(bot)
  client.createWebhookHandler()(req, res, next)

  expect(res.sendStatus).toBeCalledWith(403)
});

// test('should respond with 403 for failed subsription', () => {
//
//   var next = jest.fn()
//   var req = {
//     headers: {
//       'user-agent': 'facebookplatform'
//     },
//     query: {
//       'hub.mode': 'subscribe'
//     }
//   }
//
//   var res = {
//     sendStatus: jest.fn()
//   }
//
//   var client = new FacebookMessengerClient(bot)
//   client.createWebhookHandler()(req, res, next)
//
//   expect(res.sendStatus).toBeCalledWith(403)
// });

// - Message success
// - Event Failure

//     client.handleEvent(bot, req, res)
//     res.success()

//
// FacebookMessengerClient.prototype.handleEvent = function(bot, req, res) {
//
// var client = this
// var body = req.body
//
// if (body.object == 'page') {
//
//   body.entry.forEach(function(pageEntry) {
//
//     pageEntry.messaging.forEach(function(messagingEvent) {
//       if (messagingEvent.message) {
//         client.receivedMessage(bot, messagingEvent);
//       } else {
//         console.log("Webhook received unknown messagingEvent: ", messagingEvent);
//       }
//     });
//
//   });
//
// }
// }
//
// FacebookMessengerClient.prototype.receivedMessage = function(bot, event) {
// var senderID = event.sender.id
// var message = event.message
//
// var session = new Session(senderID, {}, this)
//
// bot.trigger('message_received', message, session)
// }
//
// FacebookMessengerClient.prototype.send = function(session, text) {
//
// console.log('Sending "' + text + '"')
//
// var messageData = {
//   recipient: {
//     id: session.user
//   },
//   message: {
//     text: text
//   }
// };
//
// request({
//   uri: 'https://graph.facebook.com/v2.6/me/messages',
//   qs: { access_token: this.config.access_token },
//   method: 'POST',
//   json: messageData
//
// }, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log("Successfully sent message.");
//   } else {
//     console.error("Unable to send message.");
//   }
// });
// }
//
// FacebookMessengerClient.prototype.startTyping = function(session) {
//
// var messageData = {
//   recipient: {
//     id: session.user
//   },
//   sender_action: "typing_on"
// }
//
// request({
//   uri: 'https://graph.facebook.com/v2.6/me/messages',
//   qs: { access_token: this.config.access_token },
//   method: 'POST',
//   json: messageData
// }, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log("Successfully sent message.");
//   } else {
//     console.error("Unable to send message.");
//   }
// });
// }
