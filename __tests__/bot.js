jest.unmock('request')
jest.unmock('fs')
jest.unmock('mock-fs')
jest.unmock('nock')
jest.unmock('../lib/bot')
jest.unmock('../lib/event-emitter')
jest.unmock('../lib/event')
jest.unmock('../lib/topic')

var mock = require('mock-fs')
var nock = require('nock')
var Bot = require('../lib/bot')

var session = {
  getUserContext: jest.fn(() => new Object({})),
  startTyping: jest.fn(),
  send: jest.fn()
}

test('should default to name "bot"', () => {
  var bot = new Bot()

  expect(bot.name).toEqual('bot')
})

test('should use passed in name', () => {
  var bot = new Bot('bender')

  expect(bot.name).toEqual('bender')
})

test('should start typing on message_received', () => {
  var bot = new Bot()

  bot.trigger('message_received', {}, session)

  expect(session.startTyping).toBeCalled()
})

test('should respond with default response when message not handled', () => {
  var bot = new Bot()

  bot.trigger('message_received', {}, session)

  expect(session.send).toBeCalled()
})

test('should respond with error when no webhook listeners configured', () => {
  var error = jest.fn()
  var bot = new Bot()

  bot.trigger('webhook', {}, {
    error: error
  })

  expect(error).toBeCalled()
})

test('should trigger hears function if it matches', () => {
  var handler = jest.fn()
  var bot = new Bot()

  bot.hears(function() { return true }, handler)
  bot.trigger('message_received', {}, session)

  expect(handler).toBeCalled()
})

test('should trigger move to next hears function if it does not match', () => {
  var handler = jest.fn()
  var bot = new Bot()

  bot.hears(function() { return false }, null)
  bot.hears(function() { return true }, handler)
  bot.trigger('message_received', {}, session)

  expect(handler).toBeCalled()
})

test('should trigger hears functions in order of declaration', () => {
  var handler = jest.fn()
  var handler2 = jest.fn()
  var bot = new Bot()

  bot.hears(function() { return true }, handler)
  bot.hears(function() { return false }, handler2)

  bot.trigger('message_received', {}, session)

  expect(handler).toBeCalled()
  expect(handler2).not.toBeCalled()
})

test('should consume a component', () => {
  var component = jest.fn()
  var bot = new Bot()
  bot.use(component)
  expect(component).toBeCalledWith(bot)
})

test('should download attachment from URI', (done) => {
  var bot = new Bot()

  mock()

  nock('http://www.google.co.uk')
  .get('/')
  .reply(200, 'Hello World')

  bot.download({
    url: 'http://www.google.co.uk'
  }, function(url) {

    var fs = require('fs')

    fs.readFile(url, 'utf8', function (err, data) {

      expect(data).toEqual('Hello World')

      mock.restore()
      done()
    })
  })
})

test('should download base64 encoded attachment', (done) => {
  var bot = new Bot()

  mock()

  bot.download({
    data: 'data:application/text;base64,SGVsbG8gV29ybGQ='
  }, function(url) {

    var fs = require('fs')

    fs.readFile(url, 'utf8', function (err, data) {

      expect(data).toEqual('Hello World')

      mock.restore()
      done()
    })
  })
})
