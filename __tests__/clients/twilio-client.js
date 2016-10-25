jest.unmock('../../lib/clients/twilio-client');

const Bot = require('../../lib/bot');
const TwilioClient = require('../../lib/clients/twilio-client');

const bot = new Bot();

const res = {
  send: jest.fn(),
};

const req = {
  headers: {
    'user-agent': 'TwilioProxy',
  },
  body: {
    Body: 'text',
  },
};

const postReq = {
  headers: {
    'user-agent': 'TwilioProxy',
  },
  body: {
    From: '1',
    Body: 'text',
  },
};

const getReq = {
  headers: {
    'user-agent': 'TwilioProxy',
  },
  query: {
    From: '1',
    Body: 'text',
  },
};

it('should use environmental variables for sid, token and phone number', () => {
  process.env.TWILIO_ACCOUNT_SID = 'sid';
  process.env.TWILIO_AUTH_TOKEN = 'token';
  process.env.TWILIO_PHONE_NUMBER = 'number';
  const client = new TwilioClient()(bot);
  expect(client.config.account_sid).toEqual('sid');
  expect(client.config.auth_token).toEqual('token');
  expect(client.config.phone_number).toEqual('number');
  process.env.TWILIO_ACCOUNT_SID = undefined;
  process.env.TWILIO_AUTH_TOKEN = undefined;
  process.env.TWILIO_PHONE_NUMBER = undefined;
});

it('should use configuration object for key, secrets and tokens', () => {
  const config = {
    account_sid: 'sid',
    auth_token: 'token',
    phone_number: 'number',
  };
  const client = new TwilioClient(config)(bot);
  expect(client.config.account_sid).toEqual('sid');
  expect(client.config.auth_token).toEqual('token');
  expect(client.config.phone_number).toEqual('number');
});

it('should listen for tweets mentioning the bot', () => {
  const handler = jest.fn();
  const originalImp = TwilioClient.prototype.createWebhookHandler;
  TwilioClient.prototype.createWebhookHandler = () => handler;
  // eslint-disable-next-line no-unused-vars
  const client = new TwilioClient()(bot);
  expect(bot.on).toBeCalledWith('webhook', handler);
  TwilioClient.prototype.createWebhookHandler = originalImp;
});

it('should handle webhook with user agent TwilioProxy', () => {
  const next = jest.fn();
  const client = new TwilioClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(next).not.toBeCalled();
});

it('should trigger message_received event on bot for message via POST', () => {
  const next = jest.fn();
  const client = new TwilioClient()(bot);
  const session = client.createWebhookHandler()(postReq, res, next);
  expect(bot.trigger).toBeCalledWith('message_received', {
    text: 'text',
  }, session);
});

it('should trigger message_received event on bot for message via GET', () => {
  const next = jest.fn();
  const client = new TwilioClient()(bot);
  const session = client.createWebhookHandler()(getReq, res, next);
  expect(bot.trigger).toBeCalledWith('message_received', {
    text: 'text',
  }, session);
});

it('should create valid session for message via POST', () => {
  const next = jest.fn();
  const client = new TwilioClient()(bot);
  const session = client.createWebhookHandler()(postReq, res, next);
  expect(session.user).toEqual('1');
  expect(session.client).toBe(client);
});

it('should create valid session for message via GET', () => {
  const next = jest.fn();
  const client = new TwilioClient()(bot);
  const session = client.createWebhookHandler()(getReq, res, next);
  expect(session.user).toEqual('1');
  expect(session.client).toBe(client);
});

it('should respond with empty json object for message', () => {
  const next = jest.fn();
  const client = new TwilioClient()(bot);
  client.createWebhookHandler()(req, res, next);
  expect(res.send).toBeCalledWith({});
});

it('should send text when sending message', () => {
  const client = new TwilioClient({
    phone_number: '1',
  })(bot);
  client.send({
    user: '1',
  }, 'text');
  expect(client.twilio.sendMessage).toBeCalledWith({
    to: '1',
    from: '1',
    body: 'text',
  });
});
