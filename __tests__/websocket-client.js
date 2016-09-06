jest.unmock('../lib/websocket-client')

var io = require('socket.io')
var WebsocketClient = require('../lib/websocket-client')

var socketClient = io()
var session = {
  socket: {
    emit: jest.fn()
  }
}

test('should handle web socket connection event', function() {
  var handler = jest.fn()

  var originalImp = WebsocketClient.prototype.createConnectionHandler
  WebsocketClient.prototype.createConnectionHandler = function() {
    return handler
  }

  var client = new WebsocketClient(socketClient)

  expect(socketClient.on).toBeCalledWith('connection', handler)
  WebsocketClient.prototype.createConnectionHandler = originalImp
})

test('should handle web socket message event', function() {

  var handler = jest.fn()
  var socket = {
    on: jest.fn()
  }

  var client = new WebsocketClient(socketClient)
  client.createMessageHandler = function() {
    return handler
  }

  client.createConnectionHandler()(socket)

  expect(socket.on).toBeCalledWith('message', handler)
})

test('should emit message event with text when sending message', function() {

  var client = new WebsocketClient(socketClient)
  client.send(session, 'Hey')

  expect(session.socket.emit).toBeCalledWith('message', {
    text: 'Hey'
  })
})

test('should emit typing event with text when sending typing event', function() {

  var client = new WebsocketClient(socketClient)
  client.startTyping(session)

  expect(session.socket.emit).toBeCalledWith('typing', {})
})
