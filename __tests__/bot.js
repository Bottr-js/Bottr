jest.unmock('../lib/bot')
jest.unmock('../lib/event-emitter')
jest.unmock('../lib/event')

var Bot = require('../lib/bot')

test('should default to name "bot"', () => {
  var bot = new Bot()
  expect(bot.name).toEqual('bot')
});

test('should use passed in name', () => {
  var bot = new Bot('bender')
  expect(bot.name).toEqual('bender')
});

test('on message recieved bot should start typing', () => {
  var typing = jest.fn()
  var bot = new Bot('bender')

  bot.trigger('message_received', {}, {
    startTyping: typing,
    send: jest.fn()
  })

  expect(typing).toBeCalled()
});

// test('respond with error when no webhook listeners configured', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

test('respond with default response when message not handled', () => {
  var send = jest.fn()
  var bot = new Bot('bender')

  bot.trigger('message_received', {}, {
    startTyping: jest.fn(),
    send: send
  })

  expect(send).toBeCalled()
});

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

//
// Bot.prototype.hears = function(pattern, handler) {
//
//   var matcher = pattern
//
//   if (pattern instanceof Array) {
//     matcher = new Matchers.ArrayMatcher(pattern)
//   } else if (pattern instanceof String) {
//     matcher = new Matchers.StringMatcher(pattern)
//   } else if(pattern instanceof RegExp) {
//     matcher = new Matchers.RegExpMatcher(pattern)
//   }
//
//   this.on('message_received', function(message, session, next) {
//     if (matcher(message)) {
//       handler(message, session)
//     } else {
//       next()
//     }
//   })
// }

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

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

//
// Bot.prototype.downloadFileFromUrl = function(url, callback) {
//   // request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
//   // Get data and pass to download file method
//   // this.downloadFileFromData(data, callback)
// }

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

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

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });
