jest.unmock('../../lib/clients/twitter-client');

const Bot = require('../../lib/bot');
const TwitterClient = require('../../lib/clients/twitter-client');

const bot = new Bot();

it('should default to consumer key from environmental variable', () => {
  const client = new TwitterClient()(bot);
  client.send(null, 'text');
  expect(client.twit.post).toBeCalledWith('statuses/update', { status: 'text' });
});

it('should use environmental variables for key, secrets and tokens', () => {
  process.env.TWITTER_CONSUMER_KEY = 'key';
  process.env.TWITTER_CONSUMER_SECRET = 'secret';
  process.env.TWITTER_ACCESS_TOKEN = 'token';
  process.env.TWITTER_ACCESS_TOKEN_SECRET = 'secret';
  const client = new TwitterClient()(bot);
  expect(client.config.consumer_key).toEqual('key');
  expect(client.config.consumer_secret).toEqual('secret');
  expect(client.config.access_token).toEqual('token');
  expect(client.config.access_token_secret).toEqual('secret');
  process.env.TWITTER_CONSUMER_KEY = undefined;
  process.env.TWITTER_CONSUMER_SECRET = undefined;
  process.env.TWITTER_ACCESS_TOKEN = undefined;
  process.env.TWITTER_ACCESS_TOKEN_SECRET = undefined;
});

it('should use configuration object for key, secrets and tokens', () => {
  const config = {
    consumer_key: 'key',
    consumer_secret: 'secret',
    access_token: 'token',
    access_token_secret: 'secret',
  };
  const client = new TwitterClient(config)(bot);
  expect(client.config.consumer_key).toEqual('key');
  expect(client.config.consumer_secret).toEqual('secret');
  expect(client.config.access_token).toEqual('token');
  expect(client.config.access_token_secret).toEqual('secret');
});

it('should listen for tweets mentioning the bot', () => {
  const client = new TwitterClient()(bot);
  client.send(null, 'text');
  expect(client.twit.stream).toBeCalledWith('statuses/filter', { track: `@${bot.name}` });
});

it('should handle for tweets mentioning the bot', () => {
  const handler = jest.fn();
  const originalImp = TwitterClient.prototype.createTweetHandler;
  TwitterClient.prototype.createTweetHandler = () => handler;
  const client = new TwitterClient()(bot);
  expect(client.stream.on).toBeCalledWith('tweet', handler);
  TwitterClient.prototype.createTweetHandler = originalImp;
});

it('should create valid session for message', () => {
  const client = new TwitterClient()(bot);
  const session = client.createTweetHandler()({
    user: {
      id: '1',
    },
    text: 'text',
  });
  expect(session.user).toEqual('1');
  expect(session.client).toBe(client);
});

it('should trigger received_message event on bot for message', () => {
  const client = new TwitterClient()(bot);
  const session = client.createTweetHandler()({
    user: {
      id: '1',
    },
    text: 'text',
  });
  expect(bot.trigger).toBeCalledWith('message_received', {
    text: 'text',
  }, session);
});

it('should post a status when sending message', () => {
  const client = new TwitterClient()(bot);
  client.send(null, 'text');
  expect(client.twit.post).toBeCalledWith('statuses/update', { status: 'text' });
});
