jest.unmock('../lib/webhook-client')

var Bot = require('../lib/bot')
var WebhookClient = require('../lib/webhook-client')

var bot = new Bot()
var res = {
  success: jest.fn(),
  error: jest.fn()
}
var req = {}

beforeEach(() => {
  req = {
    query: {
      callback: 'callback'
    },
    body: {
      text: 'text'
    }
  }
});

//     var body = req.body
//     var callbackURI = req.query.callback;
//
//     if (!callbackURI) {
//       res.error('No callback URI parameter provided.');
//       return
//     }
//
//     if (!body.text) {
//       res.error('No text provided in body for the message.');
//       return
//     }
//
//     var session = new Session(body.user, {}, this)
//     session.callbackURI = callbackURI
//
//     bot.trigger('message_received', body, session)
//     res.success()


test('registers for webhook event', () => {

  var handler = jest.fn()

  var originalImp = WebhookClient.prototype.createWebhookHandler
  WebhookClient.prototype.createWebhookHandler = function() {
    return handler
  }

  var client = new WebhookClient(bot)

  expect(bot.on).toBeCalledWith('webhook', handler)
  WebhookClient.prototype.createWebhookHandler = originalImp
});

test('returns error on webhook request without callback URI', () => {
  var client = new WebhookClient(bot)
  req.query.callback = undefined

  client.createWebhookHandler(bot)(req, res)
  expect(res.error).toBeCalled()
});

test('returns error on webhook request without text', () => {
  var client = new WebhookClient(bot)
  req.body.text = undefined

  client.createWebhookHandler(bot)(req, res)
  expect(res.error).toBeCalled()
});

test('creates valid session when handling webhook request ', () => {
  var client = new WebhookClient(bot)
  client.createWebhookHandler(bot)(req, res)
});

test('triggers message_received event on bot when handling webhook request ', () => {
  var client = new WebhookClient(bot)
  client.createWebhookHandler(bot)(req, res)
});

test('returns success on webhook request', () => {
  var client = new WebhookClient(bot)
  client.createWebhookHandler(bot)(req, res)
});

// WebhookClient.prototype.send = function(session, text) {
//   request({
//     uri: session.callbackURI,
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       text: text
//     })
//   }, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log("Successfully sent message.");
//     } else {
//       console.error("Unable to send message.");
//     }
//   });
// }

test('creates valid message when sending message', () => {

});
