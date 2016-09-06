jest.unmock('../lib/websocket-client')

var Bot = require('../lib/bot')
var io = require('socket.io')
var WebsocketClient = require('../lib/websocket-client')

var bot = new Bot()
var socketClient = io()
var session = {
  socket: {
    emit: jest.fn()
  }
}

test('should store reference to bot', () => {
  var client = new WebsocketClient(bot, socketClient)
  expect(client.bot).toEqual(bot)
})

test('should handle web socket connection event', () => {
  var handler = jest.fn()

  var originalImp = WebsocketClient.prototype.createConnectionHandler
  WebsocketClient.prototype.createConnectionHandler = () => {
    return handler
  }
  var client = new WebsocketClient(bot, socketClient)

  expect(socketClient.on).toBeCalledWith('connection', handler)
  WebsocketClient.prototype.createConnectionHandler = originalImp
})

test('should handle web socket message event', () => {

  var handler = jest.fn()
  var socket = {
    on: jest.fn()
  }

  var client = new WebsocketClient(bot, socketClient)
  client.createMessageHandler = () => {
    return handler
  }

  client.createConnectionHandler()(socket)

  expect(socket.on).toBeCalledWith('message', handler)
})

test('should create valid session when handling message', () => {
  var client = new WebsocketClient(bot, socketClient)

  var session = client.createMessageHandler()({
    user: "1"
  })

  expect(session.user).toEqual("1")
  expect(session.context).toEqual({})
  expect(session.client).toBe(client)
})

test('should store socket with session when handling message', () => {
  var client = new WebsocketClient(bot, socketClient)
  var socket = {}

  var session = client.createMessageHandler(socket)({})

  expect(session.socket).toBe(socket)
})

test('should trigger message received event on bot when handling message', () => {
  var client = new WebsocketClient(bot, socketClient)
  var data = {}

  var session = client.createMessageHandler()(data)

  expect(bot.trigger).toBeCalledWith('message_received', data, session)
})

test('should emit message event with text when sending message', () => {

  var client = new WebsocketClient(bot, socketClient)
  client.send(session, 'Hey')

  expect(session.socket.emit).toBeCalledWith('message', {
    text: 'Hey'
  })
})

test('should emit typing event with text when sending typing event', () => {

  var client = new WebsocketClient(bot, socketClient)
  client.startTyping(session)

  expect(session.socket.emit).toBeCalledWith('typing', {})
})
