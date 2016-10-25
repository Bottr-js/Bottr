jest.unmock('../../lib/clients/websocket-client');

const Bot = require('../../lib/bot');
const io = require('socket.io');
const WebsocketClient = require('../../lib/clients/websocket-client');

const bot = new Bot();
const socketClient = io();

it('should store reference to bot', () => {
  const client = new WebsocketClient(socketClient)(bot);
  expect(client.bot).toEqual(bot);
});

it('should handle web socket connection event', () => {
  const handler = jest.fn();
  const originalImp = WebsocketClient.prototype.createConnectionHandler;
  WebsocketClient.prototype.createConnectionHandler = () => handler;
  // eslint-disable-next-line no-unused-vars
  const client = new WebsocketClient(socketClient)(bot);
  expect(socketClient.on).toBeCalledWith('connection', handler);
  WebsocketClient.prototype.createConnectionHandler = originalImp;
});

it('should handle web socket message event', () => {
  const handler = jest.fn();
  const socket = {
    on: jest.fn(),
  };
  const client = new WebsocketClient(socketClient)(bot);
  client.createMessageHandler = () => handler;
  client.createConnectionHandler()(socket);
  expect(socket.on).toBeCalledWith('message', handler);
});

it('should create valid session when handling message', () => {
  const client = new WebsocketClient(socketClient)(bot);
  const session = client.createMessageHandler()({
    user: '1',
  });
  expect(session.user).toEqual('1');
  expect(session.client).toBe(client);
});

it('should store socket with session when handling message', () => {
  const client = new WebsocketClient(socketClient)(bot);
  const socket = {};
  const session = client.createMessageHandler(socket)({});
  expect(session.socket).toBe(socket);
});

it('should trigger message received event on bot when handling message', () => {
  const client = new WebsocketClient(socketClient)(bot);
  const data = {};
  const session = client.createMessageHandler()(data);
  expect(bot.trigger).toBeCalledWith('message_received', data, session);
});

it('should emit message event with text when sending message', () => {
  const client = new WebsocketClient(socketClient)(bot);
  const session = {
    socket: {
      emit: jest.fn(),
    },
  };
  client.send(session, 'Hey');
  expect(session.socket.emit).toBeCalledWith('message', {
    text: 'Hey',
  });
});

it('should emit typing event with text when sending typing event', () => {
  const client = new WebsocketClient(socketClient)(bot);
  const session = {
    socket: {
      emit: jest.fn(),
    },
  };
  client.startTyping(session);
  expect(session.socket.emit).toBeCalledWith('typing', {});
});
