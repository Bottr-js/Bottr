jest.unmock('request')
jest.unmock('fs')
jest.unmock('mock-fs')
jest.unmock('../lib/bot')
jest.unmock('../lib/event-emitter')
jest.unmock('../lib/event')

var Bot = require('../lib/bot')

var session = {
  startTyping: jest.fn(),
  send: jest.fn()
}

test('should default to name "bot"', () => {
  var bot = new Bot()
  expect(bot.name).toEqual('bot')
});

test('should use passed in name', () => {
  var bot = new Bot('bender')
  expect(bot.name).toEqual('bender')
});

test('on message recieved bot should start typing', () => {
  var bot = new Bot()

  bot.trigger('message_received', {}, session)

  expect(session.startTyping).toBeCalled()
});

test('respond with default response when message not handled', () => {
  var bot = new Bot()

  bot.trigger('message_received', {}, session)

  expect(session.send).toBeCalled()
});

test('respond with error when no webhook listeners configured', () => {
  var error = jest.fn()
  var bot = new Bot()

  bot.trigger('webhook', {}, {
    error: error
  })

  expect(error).toBeCalled()
});

test('should trigger hears function if it matches', () => {
  var handler = jest.fn()
  var bot = new Bot()

  bot.hears(function() { return true }, handler)
  bot.trigger('message_received', {}, session)

  expect(handler).toBeCalled()
});

test('should trigger move to next hears function if it does not mtch', () => {
  var handler = jest.fn()
  var bot = new Bot()

  bot.hears(function() { return false }, null)
  bot.hears(function() { return true }, handler)
  bot.trigger('message_received', {}, session)

  expect(handler).toBeCalled()
});

test('should trigger hears functions in order of declartion', () => {
  var handler = jest.fn()
  var handler2 = jest.fn()
  var bot = new Bot()

  bot.hears(function() { return true }, handler)
  bot.hears(function() { return false }, handler2)

  bot.trigger('message_received', {}, session)

  expect(handler).toBeCalled()
  expect(handler2).not.toBeCalled()
});

test('should consume component', () => {
  var component = jest.fn()
  var bot = new Bot()
  bot.use(component)
  expect(component).toBeCalledWith(bot)
});

//
// Bot.prototype.downloadFileFromUrl = function(url, callback) {
//   // request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
//   // Get data and pass to download file method
//   // this.downloadFileFromData(data, callback)
// }

test('should download attachment from URI', (done) => {
  var bot = new Bot()

  bot.download({
    url: 'http://www.google.co.uk'
  }, function(url) {

    var fs = require('fs')

    fs.readFile(url, 'utf8', function (err, data) {

      expect(data).toEqual('Hello World')

      mock.restore();
      done();
    });
  })
});

test('should download base64 encoded attachment', (done) => {
  var bot = new Bot()

  var mock = require('mock-fs');
  mock()

  bot.download({
    data: 'data:application/text;base64,SGVsbG8gV29ybGQ='
  }, function(url) {

    var fs = require('fs')

    fs.readFile(url, 'utf8', function (err, data) {

      expect(data).toEqual('Hello World')

      mock.restore();
      done();
    });
  })
});
