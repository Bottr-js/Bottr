jest.unmock('../lib/bot')
jest.unmock('../lib/listen')

var Bot = require('../lib/bot')
require('../lib/listen')

test('listen configures server with bot', () => {

  var bot = new Bot()
  var server = bot.listen()

  expect(server.use).toBeCalledWith(bot)
});

test('listen defaults to port 3000', () => {

  var bot = new Bot()
  var server = bot.listen()

  expect(server.listen).toBeCalledWith(3000)
});

test('listen uses port from environment', () => {

  process.env.PORT = 2000

  var bot = new Bot()
  var server = bot.listen()

  expect(server.listen).toBeCalledWith('2000')
});

test('listen uses port passed in as argument', () => {

  var bot = new Bot()
  var server = bot.listen(1000)

  expect(server.listen).toBeCalledWith(1000)
});
