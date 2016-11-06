/* global spyOn */
jest.unmock('../../lib/clients/facebook-messenger-client');
jest.unmock('../../lib/clients/base-client');

const Bot = require('../../lib/bot');
const FacebookMessengerClient = require('../../lib/clients/facebook-messenger-client');

const bot = new Bot();

it('should use environmental variables for access and verify token', () => {
  process.env.MESSENGER_ACCESS_TOKEN = 'access';
  process.env.MESSENGER_VERIFY_TOKEN = 'verify';
  const client = new FacebookMessengerClient()(bot);
  expect(client.config.access_token).toEqual('access');
  expect(client.config.verify_token).toEqual('verify');
  process.env.MESSENGER_ACCESS_TOKEN = undefined;
  process.env.MESSENGER_VERIFY_TOKEN = undefined;
});

it('should use configuration object for access and verify token', () => {
  const client = new FacebookMessengerClient({
    access_token: 'access',
    verify_token: 'verify',
  })(bot);
  expect(client.config.access_token).toEqual('access');
  expect(client.config.verify_token).toEqual('verify');
});

it('should register for webhook event', () => {
  const handler = jest.fn();
  const originalImp = FacebookMessengerClient.prototype.createWebhookHandler;
  FacebookMessengerClient.prototype.createWebhookHandler = () => handler;
  // eslint-disable-next-line no-unused-vars
  const client = new FacebookMessengerClient()(bot);
  expect(bot.on).toBeCalledWith('webhook', handler);
  FacebookMessengerClient.prototype.createWebhookHandler = originalImp;
});

it('should not handle webhook without x-hub-signature and facebook platform user agent', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'Snapchat bro',
    },
  };
  const client = new FacebookMessengerClient()(bot);
  client.createWebhookHandler()(req, {}, next);
  expect(next).toBeCalled();
});

it('should respond with challenge for successful subsription', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test',
      'hub.challenge': 'challenge',
    },
  };
  const res = {
    send: jest.fn(),
  };
  const client = new FacebookMessengerClient({
    verify_token: 'test',
  })(bot);
  client.createWebhookHandler()(req, res, next);
  expect(res.send).toBeCalledWith('challenge');
});

it('should respond with 403 for failed subscription', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {
      'hub.mode': 'subscribe',
    },
  };
  const res = {
    sendStatus: jest.fn(),
  };
  const client = new FacebookMessengerClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(res.sendStatus).toBeCalledWith(403);
});

it('should respond with success for message', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [{
            sender: {
              id: '1',
            },
            message: 'hey',
          }],
        },
      ],
    },
  };
  const res = {
    status: jest.fn(),
    end: jest.fn(),
  };
  const client = new FacebookMessengerClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(res.status).toBeCalledWith(200);
  expect(res.end).toBeCalled();
});

it('should trigger received_message event on bot for message', (done) => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [{
            sender: {
              id: '1',
            },
            message: 'hey',
          }],
        },
      ],
    },
  };
  const res = {
    end: jest.fn(),
    status: jest.fn(),
    success: jest.fn(),
  };
  const client = new FacebookMessengerClient()(bot);
  bot.trigger = jest.fn((event, message, session) => {
    expect(event).toEqual('message_received', message, session);
    done();
  });
  client.createWebhookHandler()(req, res, next);
});

it('should create valid session for message', (done) => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [{
            sender: {
              id: '1',
            },
            message: 'hey',
          }],
        },
      ],
    },
  };
  const res = {
    status: jest.fn(),
    success: jest.fn(),
  };
  const client = new FacebookMessengerClient()(bot);
  bot.trigger = jest.fn((event, message, session) => {
    expect(session.user).toEqual('1');
    expect(session.client).toBe(client);
    done();
  });
  client.createWebhookHandler()(req, res, next);
});

it('should respond with 400 for non-page event', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {},
    body: {
      object: 'ufo',
      entry: [],
    },
  };
  const res = {
    sendStatus: jest.fn(),
  };
  const client = new FacebookMessengerClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(res.sendStatus).toBeCalledWith(400);
});

it('should respond with 400 for unknown event', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [
            {},
          ],
        },
      ],
    },
  };
  const res = {
    status: jest.fn(),
    end: jest.fn(),
  };
  const client = new FacebookMessengerClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(res.status).toBeCalledWith(400);
  expect(res.end).toBeCalled();
});

it('should log error for unknown event', () => {
  const next = jest.fn();
  const req = {
    headers: {
      'user-agent': 'facebookplatform',
    },
    query: {},
    body: {
      object: 'page',
      entry: [
        {
          messaging: [
            {},
          ],
        },
      ],
    },
  };
  const res = {
    end: jest.fn(),
    sendStatus: jest.fn(),
    status: jest.fn(),
  };
  const spy = spyOn(console, 'error');
  const client = new FacebookMessengerClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(spy).toBeCalled();
});

it('creates valid request when sending message', () => {
  const session = {
    user: '1',
  };
  const client = new FacebookMessengerClient()(bot);
  const request = client.send(session, 'text');
  expect(request.uri).toEqual('https://graph.facebook.com/v2.6/me/messages');
  expect(request.method).toEqual('POST');
  expect(request.json).toEqual({
    recipient: {
      id: session.user,
    },
    message: {
      text: 'text',
    },
  });
});

it('creates valid request when triggering typing indicator', () => {
  const session = {
    user: '1',
  };
  const client = new FacebookMessengerClient()(bot);
  const request = client.startTyping(session);
  expect(request.uri).toEqual('https://graph.facebook.com/v2.6/me/messages');
  expect(request.method).toEqual('POST');
  expect(request.json).toEqual({
    recipient: {
      id: '1',
    },
    sender_action: 'typing_on',
  });
});

it('creates valid request when grah_uri changes (infra.cat integration)', () => {
  const session = {
    user: '1',
  };
  const newURI = 'https://meow.infra.cat';
  const client = new FacebookMessengerClient({
    graph_uri: newURI,
  })(bot);
  const request = client.startTyping(session);
  expect(request.uri).toEqual(`${newURI}/v2.6/me/messages`);
  expect(request.method).toEqual('POST');
  expect(request.json).toEqual({
    recipient: {
      id: '1',
    },
    sender_action: 'typing_on',
  });
});
