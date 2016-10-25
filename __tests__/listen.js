jest.unmock('../lib/listen');
jest.unmock('../lib/bot');

const Bot = require('../lib/bot');

require('../lib/listen');

it('should start listening to the server', () => {
  const bot = new Bot();
  const server = bot.listen();
  expect(server.use).toBeCalledWith(bot);
});

it('should listen to the default port 3000', () => {
  const bot = new Bot();
  const server = bot.listen();
  expect(server.listen).toBeCalledWith(3000);
});

it('should listen to the port from environment', () => {
  process.env.PORT = 2000;
  const bot = new Bot();
  const server = bot.listen();
  expect(server.listen).toBeCalledWith('2000');
});

it('should listen to the port passed in as an argument', () => {
  const bot = new Bot();
  const server = bot.listen(1000);
  expect(server.listen).toBeCalledWith(1000);
});
