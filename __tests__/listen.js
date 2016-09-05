jest.unmock('../lib/bot')
jest.unmock('../lib/listen')

var Bot = require('../lib/bot')

require('../lib/listen')

test('returns server', () => {
  var bot = new Bot()
  var server = bot.listen()
  expect(server).not.toBeNull();
});

// Bot.prototype.listen = function(port) {
//   var serverPort = port || process.env.PORT || 3000
//   var server = new Server()
//   server.use(this)
//   server.listen(serverPort)
//   console.log('Bot is listening on port ' + serverPort)
// }
