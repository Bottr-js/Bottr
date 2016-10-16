/* global spyOn */

jest.unmock('../lib/facebook-messenger-client')

var Bot = require('../lib/bot')
var FacebookMessengerClient = require('../lib/facebook-messenger-client')

var bot = new Bot()

test('should use environmental variables for access and verify token', () => {

  process.env.MESSENGER_ACCESS_TOKEN = 'access'
  process.env.MESSENGER_VERIFY_TOKEN = 'verify'

  var client = new FacebookMessengerClient()(bot)

  expect(client.config.access_token).toEqual('access')
  expect(client.config.verify_token).toEqual('verify')

  process.env.MESSENGER_ACCESS_TOKEN = undefined
  process.env.MESSENGER_VERIFY_TOKEN = undefined
})

test('should use configuration object for access and verify token', () => {

  var client = new FacebookMessengerClient({
    access_token: 'access',
    verify_token: 'verify'
  })(bot)

  expect(client.config.access_token).toEqual('access')
  expect(client.config.verify_token).toEqual('verify')
})

test('should register for webhook event', () => {

  var handler = jest.fn()

  var originalImp = FacebookMessengerClient.prototype.createWebhookHandler
  FacebookMessengerClient.prototype.createWebhookHandler = function() {
    return handler
  }

  var client = new FacebookMessengerClient()(bot)

  expect(bot.on).toBeCalledWith('webhook', handler)
  FacebookMessengerClient.prototype.createWebhookHandler = originalImp
})

test('should not handle webhook without x-hub-signature and facebook platform user agent', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'Snapchat bro'
    }
  }

  var client = new FacebookMessengerClient()(bot)
  client.createWebhookHandler()(req, {}, next)

  expect(next).toBeCalled()
})

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

  var client = new FacebookMessengerClient({
    verify_token: 'test'
  })(bot)

  client.createWebhookHandler()(req, res, next)

  expect(res.send).toBeCalledWith('challenge')
})

test('should respond with 403 for failed subscription', () => {

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

  var client = new FacebookMessengerClient()(bot)
  client.createWebhookHandler()(req, res, next)

  expect(res.sendStatus).toBeCalledWith(403)
})

test('should respond with success for message', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [{
            sender: {
              id: '1'
            },
            message: 'hey'
          }]
        }
      ]
    }
  }

  var res = {
    status: jest.fn(),
    end: jest.fn()
  }

  var client = new FacebookMessengerClient()(bot)
  client.createWebhookHandler()(req, res, next)

  expect(res.status).toBeCalledWith(200)
  expect(res.end).toBeCalled()
})

test('should trigger received_message event on bot for message', (done) => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [{
            sender: {
              id: '1'
            },
            message: 'hey'
          }]
        }
      ]
    }
  }

  var res = {
    success: jest.fn()
  }

  var client = new FacebookMessengerClient()(bot)

  bot.trigger = jest.fn(function(event, message, session) {
    expect(event).toEqual('message_received', message, session)
    done()
  })

  client.createWebhookHandler()(req, res, next)
})

test('should create valid session for message', (done) => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [{
            sender: {
              id: '1'
            },
            message: 'hey'
          }]
        }
      ]
    }
  }

  var res = {
    success: jest.fn()
  }

  var client = new FacebookMessengerClient()(bot)

  bot.trigger = jest.fn(function(event, message, session) {
    expect(session.user).toEqual('1')
    expect(session.client).toBe(client)
    done()
  })

  client.createWebhookHandler()(req, res, next)
})

test('should respond with 400 for non-page event', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {},
    body: {
      object: 'ufo',
      entry: []
    }
  }

  var res = {
    sendStatus: jest.fn()
  }

  var client = new FacebookMessengerClient()(bot)
  client.createWebhookHandler()(req, res, next)

  expect(res.sendStatus).toBeCalledWith(400)
})

test('should respond with 400 for unknown event', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [
            {}
          ]
        }
      ]
    }
  }

  var res = {
    status: jest.fn(),
    end: jest.fn()
  }

  var client = new FacebookMessengerClient()(bot)
  client.createWebhookHandler()(req, res, next)

  expect(res.status).toBeCalledWith(400)
  expect(res.end).toBeCalled()
})

test('should log error for unknown event', () => {

  var next = jest.fn()
  var req = {
    headers: {
      'user-agent': 'facebookplatform'
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [
            {}
          ]
        }
      ]
    }
  }

  var res = {
    sendStatus: jest.fn()
  }

  var spy = spyOn(console, 'error')
  var client = new FacebookMessengerClient()(bot)
  client.createWebhookHandler()(req, res, next)

  expect(spy).toBeCalled()
})

test('creates valid request when sending message', () => {

  var session = {
    user: '1'
  }

  var client = new FacebookMessengerClient()(bot)
  var request = client.send(session, 'text')

  expect(request.uri).toEqual('https://graph.facebook.com/v2.6/me/messages')
  expect(request.method).toEqual('POST')
  expect(request.json).toEqual({
    recipient: {
      id: session.user
    },
    message: {
      text: 'text'
    }
  })
})

test('creates valid request when triggering typing indicator', () => {

  var session = {
    user: '1'
  }

  var client = new FacebookMessengerClient()(bot)
  var request = client.startTyping(session)

  expect(request.uri).toEqual('https://graph.facebook.com/v2.6/me/messages')
  expect(request.method).toEqual('POST')
  expect(request.json).toEqual({
    recipient: {
      id: '1'
    },
    sender_action: 'typing_on'
  })
})

test('creates valid request when grah_uri changes (infra.cat integration)', () => {

  var session = {
    user: '1'
  }

  var newURI = 'https://meow.infra.cat';
  var client = new FacebookMessengerClient({
    graph_uri: newURI,
  })(bot)
  var request = client.startTyping(session)

  expect(request.uri).toEqual(newURI+'/v2.6/me/messages')
  expect(request.method).toEqual('POST')
  expect(request.json).toEqual({
    recipient: {
      id: '1'
    },
    sender_action: 'typing_on'
  })
})
