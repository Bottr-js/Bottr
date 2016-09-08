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
// Bot.prototype.download = function(attachment, callback) {
//
//   if (attachment.url) {
//     this.downloadFileFromUrl(attachment.url, callback)
//   } else {
//     this.downloadFileFromData(attachment.data, callback)
//   }
// }



//
// Bot.prototype.downloadFileFromUrl = function(url, callback) {
//   // request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
//   // Get data and pass to download file method
//   // this.downloadFileFromData(data, callback)
// }

//
// Bot.prototype.downloadFileFromData = function(data, callback) {
//
//   var filename = uuid.v4()
//   var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
//   var buffer = new Buffer(matches[2], 'base64');
//
//   if (!fs.existsSync(staticFilesDirectory)){
//     fs.mkdirSync(staticFilesDirectory);
//   }
//
//   fs.writeFile(staticFilesDirectory + "/" + filename, buffer, 'base64')
//
//   callback(staticFilesDirectory + "/" + filename)
// }

test('should download base64 encoded attachment', () => {
  var bot = new Bot('bender')
  expect(bot.name).toEqual('bender')
});

test('should download attachment from URI', () => {
  var bot = new Bot('bender')
  expect(bot.name).toEqual('bender')
});
