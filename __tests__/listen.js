jest.unmock('../lib/bot')
jest.unmock('../lib/listen')

var Bot = require('../lib/bot')

require('../lib/listen')

test('listen returns server', () => {
  var bot = new Bot()
  var server = bot.listen()
  expect(server).not.toBeNull();
});

test('listen configures server with bot', () => {
  //   server.use(this)
});

// port
//   var serverPort = port || process.env.PORT || 3000
//   server.listen(serverPort)

// env
//   var serverPort = port || process.env.PORT || 3000
//   server.listen(serverPort)

// default
//   var serverPort = port || process.env.PORT || 3000
//   server.listen(serverPort)
