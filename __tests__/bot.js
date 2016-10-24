/* eslint-disable global-require */

jest.unmock('request');
jest.unmock('fs');
jest.unmock('mock-fs');
jest.unmock('nock');
jest.unmock('../lib/bot');
jest.unmock('../lib/event-emitter');
jest.unmock('../lib/event');
jest.unmock('../lib/topic');

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mock = require('mock-fs');
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const nock = require('nock');
const Bot = require('../lib/bot');

const session = {
  getUserContext: jest.fn(() => ({})),
  startTyping: jest.fn(),
  send: jest.fn(),
};

it('should default to name "bot"', () => {
  const bot = new Bot();
  expect(bot.name).toEqual('bot');
});

it('should use passed in name', () => {
  const bot = new Bot('bender');
  expect(bot.name).toEqual('bender');
});

it('should start typing on message_received', () => {
  const bot = new Bot();
  bot.trigger('message_received', {}, session);
  expect(session.startTyping).toBeCalled();
});

it('should respond with default response when message not handled', () => {
  const bot = new Bot();
  bot.trigger('message_received', {}, session);
  expect(session.send).toBeCalled();
});

it('should respond with error when no webhook listeners configured', () => {
  const error = jest.fn();
  const bot = new Bot();
  bot.trigger('webhook', {}, {
    error,
  });
  expect(error).toBeCalled();
});

it('should trigger hears function if it matches', () => {
  const handler = jest.fn();
  const bot = new Bot();
  bot.hears(() => true, handler);
  bot.trigger('message_received', {}, session);
  expect(handler).toBeCalled();
});

it('should trigger move to next hears function if it does not match', () => {
  const handler = jest.fn();
  const bot = new Bot();
  bot.hears(() => false, null);
  bot.hears(() => true, handler);
  bot.trigger('message_received', {}, session);
  expect(handler).toBeCalled();
});

it('should trigger hears functions in order of declaration', () => {
  const handler = jest.fn();
  const handler2 = jest.fn();
  const bot = new Bot();

  bot.hears(() => true, handler);
  bot.hears(() => false, handler2);

  bot.trigger('message_received', {}, session);

  expect(handler).toBeCalled();
  expect(handler2).not.toBeCalled();
});

it('should consume a component', () => {
  const component = jest.fn();
  const bot = new Bot();
  bot.use(component);
  expect(component).toBeCalledWith(bot);
});

it('should download attachment from URI', (done) => {
  const bot = new Bot();

  mock();

  nock('http://www.google.co.uk')
  .get('/')
  .reply(200, 'Hello World');

  bot.download({
    url: 'http://www.google.co.uk',
  }, (url) => {
    const fs = require('fs');
    fs.readFile(url, 'utf8', (err, data) => {
      expect(data).toEqual('Hello World');
      mock.restore();
      done();
    });
  });
});

it('should download base64 encoded attachment', (done) => {
  const bot = new Bot();
  mock();
  bot.download({
    data: 'data:application/text;base64,SGVsbG8gV29ybGQ=',
  }, (url) => {
    const fs = require('fs');
    fs.readFile(url, 'utf8', (err, data) => {
      expect(data).toEqual('Hello World');
      mock.restore();
      done();
    });
  });
});
