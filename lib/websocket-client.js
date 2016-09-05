var Session = require('./session')

// Bot.prototype.connectToSocket = function(io) {
//
//   var bot = this
//
//   io.on('connection',  function (socket) {
//
//     console.log('new websocket connection')
//
//     socket.on('message', function(data) {
//
//       var session = {
//         user: data.user,
//         conversation: data.user,
//         account: data.user,
//         send: function(text) {
//
//           socket.emit('message', {
//             text: text
//           })
//         }
//       }
//
//       bot.trigger('message_received', data, session)
//     })
//   });
// }

function WebsocketClient() {

  var client = this

  return function(bot) {

    bot.connectToSocket = function(io) {
      var bot = this

      io.on('connection',  function (socket) {

        console.log('new websocket connection')

        socket.on('message', function(data) {

          var session = new Session(data.user, {}, client)
          session.socket = socket

          bot.trigger('message_received', data, session)
        })
      });
    }
  }
}

WebsocketClient.prototype.send = function(session, text) {
  session.socket.emit('message', {
    text: text
  })
}

WebsocketClient.prototype.startTyping = function(session) {
  session.socket.emit('typing', {})
}

module.exports = WebsocketClient
