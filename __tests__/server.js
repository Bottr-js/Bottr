jest.unmock('../lib/server');
jest.mock('http');

const Bot = require('../lib/bot');
const Server = require('../lib/server');
const WebsocketClient = require('../lib/clients/websocket-client');

it('should default to root namespace', () => {
  const bot = new Bot();
  const server = new Server();
  server.use(bot);
  expect(server.namespaces['/']).toBe(bot);
});

it('should store bot under namespace', () => {
  const bot = new Bot();
  const server = new Server();
  server.use('/bot', bot);
  expect(server.namespaces['/bot']).toBe(bot);
});

it('should listen uses port passed in as argument', () => {
  const server = new Server();
  const http = server.listen(3000);
  expect(http.listen).toBeCalledWith(3000);
});

it('should use bot router for namespace', () => {
  const server = new Server();
  const bot = new Bot();
  server.use(bot);
  const http = server.listen(3000);
  expect(http.app.use).toBeCalledWith('/', bot.router);
});

it('should inject websocket client into bot', () => {
  const server = new Server();
  const bot = new Bot();
  server.use(bot);
  server.listen(3000);
  expect(bot.use).toBeCalledWith(new WebsocketClient());
});
