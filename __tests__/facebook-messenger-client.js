jest.unmock('../lib/facebook-messenger-client')

var Bot = require('../lib/bot')
var FacebookMessengerClient = require('../lib/facebook-messenger-client')

var bot = new Bot()

test('adds 1 + 2 to equal 3', () => {

  var client = new FacebookMessengerClient(bot)

});
