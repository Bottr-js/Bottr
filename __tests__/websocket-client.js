jest.unmock('../lib/websocket-client')

var WebsocketClient = require('../lib/websocket-client')

var session = {
  socket: {
    emit: jest.fn()
  }
}

var client = new WebsocketClient()

test('should emit message event with text when sending message', function() {

  client.send(session, 'Hey')

  expect(session.socket.emit).toBeCalledWith('message', {
    text: 'Hey'
  })
})

test('should emit typing event with text when sending typing event', function() {

  client.startTyping(session)

  expect(session.socket.emit).toBeCalledWith('typing', {})
})

// test('should emit typing event with text when sending typing event', function() {
//
//   client.startTyping(session)
//
//   expect(session.socket.emit).toBeCalledWith('typing', {})
// })

// function WebsocketClient(io) {
//
//   var client = this
//
//   return function(bot) {
//
//     var bot = this
//
//     io.on('connection',  function (socket) {
//
//       console.debug('new websocket connection')
//
//       socket.on('message', function(data) {
//
//         var session = new Session(data.user, {}, client)
//         session.socket = socket
//
//         bot.trigger('message_received', data, session)
//       })
//     });
//   }
// }
//
