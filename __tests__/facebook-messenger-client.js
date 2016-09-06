jest.unmock('../lib/facebook-messenger-client')

var Bot = require('../lib/bot')
var FacebookMessengerClient = require('../lib/facebook-messenger-client')

var bot = new Bot()

test('should use enviromental variables for access and verify token', () => {

  process.env.MESSENGER_ACCESS_TOKEN = 'access'
  process.env.MESSENGER_VERIFY_TOKEN = 'verify'

  var client = new FacebookMessengerClient(bot)

  expect(client.config.access_token).toEqual('access')
  expect(client.config.verify_token).toEqual('verify')
  process.env.MESSENGER_ACCESS_TOKEN = undefined
  process.env.MESSENGER_VERIFY_TOKEN = undefined
});

test('should use configuration object for access and verify token', () => {

  var client = new FacebookMessengerClient(bot, {
    access_token: 'access',
    verify_token: 'verify'
  })

  expect(client.config.access_token).toEqual('access')
  expect(client.config.verify_token).toEqual('verify')
});
