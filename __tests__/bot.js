jest.unmock('../lib/bot')

var Bot = require('../lib/bot')

test('should default to name "bot"', () => {
  var bot = new Bot()
  expect(bot.name).toEqual('bot')
});

test('should use passed in name', () => {
  var bot = new Bot('bender')
  expect(bot.name).toEqual('bender')
});

//   this.router = Express.Router()
//   this.eventEmitter = new EventEmitter()
//
//   this.eventEmitter.addListener('message_received', function(message, session, next) {
//     session.startTyping()
//     next()
//   })
//
//   this.eventEmitter.onUnhandled('webhook', function(req, res) {
//     res.error('No webhook handlers configured')
//   })
//
//   this.eventEmitter.onUnhandled('message_received', function(message, session) {
//     session.send("Sorry my creator didn't teach me anything else")
//   })
//
//   this.router.use('/' + staticFilesDirectory, Express.static('public'));
//   this.router.use(BodyParser.json())
//   this.router.use(BodyParser.urlencoded())
//   this.router.use(new ResponseMiddleware())
//
//   this.router.get('/webhook', this.handleWebhookRequest.bind(this))
//   this.router.post('/webhook', this.handleWebhookRequest.bind(this))
// }

// test('when message is received bot should start typing', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

// test('respond with error when no webhook listeners configured', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });


//
// Bot.prototype.handleWebhookRequest = function(req, res) {
//   this.trigger('webhook', req, res);
// }


// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });


//
// Bot.prototype.trigger = function(eventName) {
//   console.log(eventName +' event triggered')
//   this.eventEmitter.emit.apply(this.eventEmitter, arguments)
// }

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });


//
// Bot.prototype.on = function(eventName, handler) {
//   this.eventEmitter.addListener(eventName, handler)
// }

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

// test('respond with error when message isn't ', () => {
//   var bot = new Bot('bender')
//   expect(bot.name).toEqual('bender')
// });

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
