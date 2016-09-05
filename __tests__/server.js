jest.unmock('../lib/server')
jest.mock('http')

var Bot = require('../lib/bot')
var Server = require('../lib/server')
var WebsocketClient = require('../lib/websocket-client')
var serveWebclient = require('../lib/serve-webclient')

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

test('serves webclient for namespace index', () => {

  var server = new Server()
  var bot = new Bot()

  server.use(bot)
  var http = server.listen(3000)

  expect(http.app.get).toBeCalledWith('/', serveWebclient)
});

test('uses bot router for namespace', () => {

  var server = new Server()
  var bot = new Bot()

  server.use(bot)
  var http = server.listen(3000)

  expect(http.app.use).toBeCalledWith('/', bot.router)
});

test('injects websocket client into bot', () => {

  var server = new Server()
  var bot = new Bot()

  server.use(bot)
  var http = server.listen(3000)

  expect(bot.use).toBeCalledWith(new WebsocketClient())
});

test('connects bot to websocket', () => {
  // var io = require('socket.io')(server)
  // bot.connectToSocket(io.of(path))
})



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
