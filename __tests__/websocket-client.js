jest.unmock('../lib/websocket-client')

var io = require('socket.io')
var WebsocketClient = require('../lib/websocket-client')

var socketClient = io()
var session = {
  socket: {
    emit: jest.fn()
  }
}

// WebsocketClient.prototype.onConnection = function(socket) {
//     console.log('new websocket connection')
//
//     socket.on('message', function(data) {
//
//       var session = new Session(data.user, {}, this)
//       session.socket = socket
//
//       bot.trigger('message_received', data, session)
//
//     }.bind(this))
// }

test('should handle web socket connection event', function() {

  var client = new WebsocketClient(socketClient)
  client.onConnection = jest.fn()

  expect(socketClient.on).toBeCalledWith('connection', client.onConnection)
})
//
// test('should emit typing event with text when sending typing event', function() {
//
//   client.startTyping(session)
//
//   expect(session.socket.emit).toBeCalledWith('typing', {})
// })


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
