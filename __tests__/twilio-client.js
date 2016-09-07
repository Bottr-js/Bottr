jest.unmock('../lib/twilio-client')

var Bot = require('../lib/bot')
var TwillioClient = require('../lib/twilio-client')

var bot = new Bot()

//   var defaults = {
//     account_sid: process.env.TWILIO_ACCOUNT_SID,
//     auth_token: process.env.TWILIO_AUTH_TOKEN,
//     phone_number: process.env.TWILIO_PHONE_NUMBER
//   }
//
//
//     bot.on('webhook', function(req, res, next) {
//
//       // If this isn't a twillio request then carry on with other handlers
//       if ( req.headers['user-agent'].indexOf('TwilioProxy') === -1 ) {
//         next()
//         return
//       }
//
//       var data = Object.assign({}, req.query, req.body)
//
//       var message = {
//         text: data.Body
//       }
//
//       var session = new Session(data.From, {}, this)
//
//       bot.trigger('message_received', message, session)
//       res.send({}) // We can't send a success code as twillio will send it
//     })

// test('should use enviromental variables for key, secrets and tokens', () => {
//
//   process.env.TWITTER_CONSUMER_KEY = 'key'
//   process.env.TWITTER_CONSUMER_SECRET = 'secret'
//   process.env.TWITTER_ACCESS_TOKEN = 'token'
//   process.env.TWITTER_ACCESS_TOKEN_SECRET = 'secret'
//
//   var client = new TwitterClient(bot)
//
//   expect(client.config.consumer_key).toEqual('key')
//   expect(client.config.consumer_secret).toEqual('secret')
//   expect(client.config.access_token).toEqual('token')
//   expect(client.config.access_token_secret).toEqual('secret')
//
//   process.env.TWITTER_CONSUMER_KEY = undefined
//   process.env.TWITTER_CONSUMER_SECRET = undefined
//   process.env.TWITTER_ACCESS_TOKEN = undefined
//   process.env.TWITTER_ACCESS_TOKEN_SECRET = undefined
// });
//
// test('should use configuration object for key, secrets and tokens', () => {
//
//   var config = {
//     consumer_key: 'key',
//     consumer_secret: 'secret',
//     access_token: 'token',
//     access_token_secret: 'secret'
//   }
//
//   var client = new TwitterClient(bot, config)
//
//   expect(client.config.consumer_key).toEqual('key')
//   expect(client.config.consumer_secret).toEqual('secret')
//   expect(client.config.access_token).toEqual('token')
//   expect(client.config.access_token_secret).toEqual('secret')
// });

test('should send text when sending message', () => {

  var client = new TwillioClient(bot, {
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
