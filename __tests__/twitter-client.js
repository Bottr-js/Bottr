jest.unmock('../lib/twitter-client')

var Bot = require('../lib/bot')
var TwitterClient = require('../lib/twitter-client')

var bot = new Bot()

test('should default to consumer key from enviromental variable', () => {

  var client = new TwitterClient(bot)
  client.send(null, 'text')

  expect(client.twit.post).toBeCalledWith('statuses/update', { status: 'text' });
});

test('should use enviromental variables for key, secrets and tokens', () => {

  process.env.TWITTER_CONSUMER_KEY = 'key'
  process.env.TWITTER_CONSUMER_SECRET = 'secret'
  process.env.TWITTER_ACCESS_TOKEN = 'token'
  process.env.TWITTER_ACCESS_TOKEN_SECRET = 'secret'

  var client = new TwitterClient(bot)

  expect(client.config.consumer_key).toEqual('key')
  expect(client.config.consumer_secret).toEqual('secret')
  expect(client.config.access_token).toEqual('token')
  expect(client.config.access_token_secret).toEqual('secret')

  process.env.TWITTER_CONSUMER_KEY = undefined
  process.env.TWITTER_CONSUMER_SECRET = undefined
  process.env.TWITTER_ACCESS_TOKEN = undefined
  process.env.TWITTER_ACCESS_TOKEN_SECRET = undefined
});

test('should use configuration object for key, secrets and tokens', () => {

  var config = {
    consumer_key: 'key',
    consumer_secret: 'secret',
    access_token: 'token',
    access_token_secret: 'secret'
  }

  var client = new TwitterClient(bot, config)

  expect(client.config.consumer_key).toEqual('key')
  expect(client.config.consumer_secret).toEqual('secret')
  expect(client.config.access_token).toEqual('token')
  expect(client.config.access_token_secret).toEqual('secret')
});

test('should listen for tweets mentioning the bot', () => {

  var client = new TwitterClient(bot)
  client.send(null, 'text')

  expect(client.twit.stream).toBeCalledWith('statuses/filter', { track: '@' + bot.name });
});

test('should handle for tweets mentioning the bot', () => {

  var handler = jest.fn()

  var originalImp = TwitterClient.prototype.createTweetHandler
  TwitterClient.prototype.createTweetHandler = function() {
    return handler
  }

  var client = new TwitterClient(bot)

  expect(client.stream.on).toBeCalledWith('tweet', handler)

  TwitterClient.prototype.createTweetHandler = originalImp
});

//       var session = new Session(tweet.user.id, {}, this)
//

test('should create valid session for message', () => {

  var handler = jest.fn()

  var client = new TwitterClient(bot)
  var session = client.createTweetHandler()({
    user: {
      id: "1"
    },
    text: 'text'
  })

  expect(session.user).toEqual("1")
  expect(session.context).toEqual({})
  expect(session.client).toBe(client)
});

test('should trigger received_message event on bot for message', () => {

  var handler = jest.fn()

  var client = new TwitterClient(bot)
  var session = client.createTweetHandler()({
    user: {
      id: "1"
    },
    text: 'text'
  })

  expect(bot.trigger).toBeCalledWith('message_received', {
    text: 'text'
  }, session)
});

test('posts status when sending message', () => {

  var client = new TwitterClient(bot)
  client.send(null, 'text')

  expect(client.twit.post).toBeCalledWith('statuses/update', { status: 'text' });
});
