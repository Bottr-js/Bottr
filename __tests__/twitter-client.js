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

  // process.env.MESSENGER_ACCESS_TOKEN = 'access'
  // process.env.MESSENGER_VERIFY_TOKEN = 'verify'
  //
  // var client = new FacebookMessengerClient(bot)
  //
  // expect(client.config.access_token).toEqual('access')
  // expect(client.config.verify_token).toEqual('verify')
  // process.env.MESSENGER_ACCESS_TOKEN = undefined
  // process.env.MESSENGER_VERIFY_TOKEN = undefined
});

test('should use configuration object for key, secrets and tokens', () => {

  // process.env.MESSENGER_ACCESS_TOKEN = 'access'
  // process.env.MESSENGER_VERIFY_TOKEN = 'verify'
  //
  // var client = new FacebookMessengerClient(bot)
  //
  // expect(client.config.access_token).toEqual('access')
  // expect(client.config.verify_token).toEqual('verify')
  // process.env.MESSENGER_ACCESS_TOKEN = undefined
  // process.env.MESSENGER_VERIFY_TOKEN = undefined
});

//   var defaults = {
//     consumer_key: process.env.TWITTER_CONSUMER_KEY,
//     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//     access_token: process.env.TWITTER_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//   }
//
//   this.config = Object.assign({}, defaults, config)
//
//
//     var stream = client.twit.stream('statuses/filter', { track: '@' + bot.name })
//
//     stream.on('tweet', function (tweet) {
//
//       var session = new Session(tweet.user.id, {}, this)
//
//       bot.trigger('message_received', {
//         text: tweet.text
//       }, session)
//
//       res.success()
//     })

test('posts status when sending message', () => {

  var client = new TwitterClient(bot)
  client.send(null, 'text')

  expect(client.twit.post).toBeCalledWith('statuses/update', { status: 'text' });
});
