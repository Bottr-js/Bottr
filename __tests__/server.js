jest.unmock('../lib/server')
jest.mock('http')

var Bot = require('../lib/bot')
var Server = require('../lib/server')
var WebsocketClient = require('../lib/websocket-client')

it('should default to root namespace', () => {

  var bot = new Bot()
  var server = new Server()

  server.use(bot)

  expect(server.namespaces['/']).toBe(bot)
})

it('should store bot under namespace', () => {

  var bot = new Bot()
  var server = new Server()

  server.use('/bot', bot)

  expect(server.namespaces['/bot']).toBe(bot)
})

it('should listen uses port passed in as argument', () => {

  var server = new Server()
  var http = server.listen(3000)

  expect(http.listen).toBeCalledWith(3000)
})

it('should use bot router for namespace', () => {

  var server = new Server()
  var bot = new Bot()

  server.use(bot)
  var http = server.listen(3000)

  expect(http.app.use).toBeCalledWith('/', bot.router)
})

it('should inject websocket client into bot', () => {

  var server = new Server()
  var bot = new Bot()

  server.use(bot)
  server.listen(3000)

  expect(bot.use).toBeCalledWith(new WebsocketClient())
})
