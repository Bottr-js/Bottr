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

test('should store reference to bot', function() {
  var client = new WebsocketClient(bot, socketClient)
  expect(client.bot).toEqual(bot)
})

test('should handle web socket connection event', function() {
  var handler = jest.fn()

  var originalImp = WebsocketClient.prototype.createConnectionHandler
  WebsocketClient.prototype.createConnectionHandler = function() {
    return handler
  }
  var client = new WebsocketClient(bot, socketClient)

  expect(socketClient.on).toBeCalledWith('connection', handler)
  WebsocketClient.prototype.createConnectionHandler = originalImp
})

test('should handle web socket message event', function() {

  var handler = jest.fn()
  var socket = {
    on: jest.fn()
  }

  var client = new WebsocketClient(bot, socketClient)
  client.createMessageHandler = function() {
    return handler
  }

  client.createConnectionHandler()(socket)

  expect(socket.on).toBeCalledWith('message', handler)
})


//
// WebsocketClient.prototype.createMessageHandler = function(socket) {
//   return function(data) {
//
//     var session = new Session(data.user, {}, this)
//     session.socket = socket
//
//     bot.trigger('message_received', data, session)
//
//   }.bind(this)
// }

test('should create valid session when handling message', function() {
  var client = new WebsocketClient(bot, socketClient)
  client.createMessageHandler()({})
})

test('should store socket with session when handling message', function() {
  var client = new WebsocketClient(bot, socketClient)
  client.createMessageHandler()({})
})

test('should trigger message received event on bot when handling message', function() {
  var client = new WebsocketClient(bot, socketClient)
  client.createMessageHandler()({})
})

test('should emit message event with text when sending message', function() {

  var client = new WebsocketClient(bot, socketClient)
  client.send(session, 'Hey')

  expect(session.socket.emit).toBeCalledWith('message', {
    text: 'Hey'
  })
})

test('should emit typing event with text when sending typing event', function() {

  var client = new WebsocketClient(bot, socketClient)
  client.startTyping(session)

  expect(session.socket.emit).toBeCalledWith('typing', {})
})
