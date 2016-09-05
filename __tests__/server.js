jest.unmock('../lib/server')

var Bot = require('../lib/bot')
var Server = require('../lib/server')

test('should default to root namespace', () => {

  var bot = new Bot()
  var server = new Server()

  server.use(bot)

  expect(server.namespaces['/']).toBe(bot)
});

test('should store bot under namespace', () => {

  var bot = new Bot()
  var server = new Server()

  server.use('/bot', bot)

  expect(server.namespaces['/bot']).toBe(bot)
});

test('listen uses port passed in as argument', () => {

  var server = new Server()
  var http = server.listen(3000)

  expect(http.listen).toBeCalledWith(3000)
});


// Server.prototype.listen = function(port) {
//
//   var app = require('express')()
//   var server = require('http').Server(app)
//   var io = require('socket.io')(server)
//
//   server.listen(port)
//
//   for (var path in this.namespaces) {
//
//     app.get(path, function (req, res) {
//       res.sendFile(__dirname + '/webclient.html');
//     });
//
//     var bot = this.namespaces[path]
//     bot.use(new WebsocketClient())
//     app.use(path, bot.router)
//     bot.connectToSocket(io.of(path))
//   }
// }
//
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
