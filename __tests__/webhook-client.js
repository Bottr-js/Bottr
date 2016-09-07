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
  var session = client.createWebhookHandler(bot)(req, res)

  expect(session.user).toEqual(req.body.user)
  expect(session.context).toEqual({})
  expect(session.client).toEqual(client)
});

test('should store callback URI with session when handling webhook request ', () => {
  var client = new WebhookClient(bot)
  var session = client.createWebhookHandler(bot)(req, res)

  expect(session.callbackURI).toEqual(req.query.callback)
});

test('triggers message_received event on bot when handling webhook request ', () => {
  var client = new WebhookClient(bot)

  var session = client.createWebhookHandler(bot)(req, res)

  expect(bot.trigger).toBeCalledWith('message_received', req.body, session)
});

test('returns success on webhook request', () => {
  var client = new WebhookClient(bot)

  client.createWebhookHandler(bot)(req, res)

  expect(res.success).toBeCalled()
});

test('creates valid request when sending message', () => {

  var client = new WebhookClient(bot)
  var session = {
    callbackURI: req.query.callback
  }
  var request = client.send(session, 'text')

  expect(request.uri).toEqual(req.query.callback)
  expect(request.method).toEqual('POST')
  expect(request.headers).toEqual({
    'Content-Type': 'application/json'
  })
  expect(request.body).toEqual(JSON.stringify({
      text: 'text'
  }))
});
