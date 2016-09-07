jest.unmock('../lib/twilio-client')

var Bot = require('../lib/bot')
var TwilioClient = require('../lib/twilio-client')

var bot = new Bot()

var res = {
  send: jest.fn()
}

var req = {
  headers: {
    'user-agent': 'TwilioProxy'
  },
  body: {
    Body: 'text'
  }
}

var post_req = {
  headers: {
    'user-agent': 'TwilioProxy'
  },
  body: {
    From: "1",
    Body: 'text'
  }
}

var get_req = {
  headers: {
    'user-agent': 'TwilioProxy'
  },
  query: {
    From: "1",
    Body: 'text'
  }
}

test('should use enviromental variables for sid, token and phone number', () => {

  process.env.TWILIO_ACCOUNT_SID = 'sid'
  process.env.TWILIO_AUTH_TOKEN = 'token'
  process.env.TWILIO_PHONE_NUMBER = 'number'

  var client = new TwilioClient(bot)

  expect(client.config.account_sid).toEqual('sid')
  expect(client.config.auth_token).toEqual('token')
  expect(client.config.phone_number).toEqual('number')

  process.env.TWILIO_ACCOUNT_SID = undefined
  process.env.TWILIO_AUTH_TOKEN = undefined
  process.env.TWILIO_PHONE_NUMBER = undefined
});

test('should use configuration object for key, secrets and tokens', () => {

  var config = {
    account_sid: 'sid',
    auth_token: 'token',
    phone_number: 'number'
  }

  var client = new TwilioClient(bot, config)

  expect(client.config.account_sid).toEqual('sid')
  expect(client.config.auth_token).toEqual('token')
  expect(client.config.phone_number).toEqual('number')
});

test('should listen for tweets mentioning the bot', () => {

  var handler = jest.fn()
  var originalImp = TwilioClient.prototype.createWebhookHandler
  TwilioClient.prototype.createWebhookHandler = function() {
    return handler
  }

  var client = new TwilioClient(bot)

  expect(bot.on).toBeCalledWith('webhook', handler)
  TwilioClient.prototype.createWebhookHandler = originalImp
});

test('should handle webhook with user agent TwilioProxy', () => {

  var next = jest.fn()
  var client = new TwilioClient(bot)

  client.createWebhookHandler()(req, res, next)

  expect(next).not.toBeCalled()
});

test('should trigger message_received event on bot for mesage via POST', () => {

  var next = jest.fn()
  var client = new TwilioClient(bot)

  var session = client.createWebhookHandler()(post_req, res, next)

  expect(bot.trigger).toBeCalledWith('message_received', {
    text: 'text'
  }, session)
});

test('should trigger message_received event on bot for mesage via GET', () => {

  var next = jest.fn()
  var client = new TwilioClient(bot)

  var session = client.createWebhookHandler()(get_req, res, next)

  expect(bot.trigger).toBeCalledWith('message_received', {
    text: 'text'
  }, session)
});

test('should create valid session for mesage via POST', () => {

  var next = jest.fn()
  var client = new TwilioClient(bot)

  var session = client.createWebhookHandler()(post_req, res, next)

  expect(session.user).toEqual("1")
  expect(session.context).toEqual({})
  expect(session.client).toBe(client)
});

test('should create valid session for mesage via GET', () => {

  var next = jest.fn()
  var client = new TwilioClient(bot)

  var session = client.createWebhookHandler()(get_req, res, next)

  expect(session.user).toEqual("1")
  expect(session.context).toEqual({})
  expect(session.client).toBe(client)
});

test('should respond with empty json object for message', () => {

  var next = jest.fn()
  var client = new TwilioClient(bot)

  client.createWebhookHandler()(req, res, next)
  expect(res.send).toBeCalledWith({})
});

test('should send text when sending message', () => {

  var client = new TwilioClient(bot, {
    phone_number: '1'
  })

  client.send({
    user: '1'
  }, 'text')

  expect(client.twilio.sendMessage).toBeCalledWith({
      to: '1',
      from: '1',
      body: 'text'
  })
});
