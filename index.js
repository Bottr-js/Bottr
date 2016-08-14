var BotKit = require('./lib/botkit');

var config = {
  contextStore: new BotKit.MemoryContextStore(),
  client: new BotKit.FacebookMessengerClient({
    appSecret: '770739fb5821713a8418148a16c352ef',
    pageAccessToken: 'EAAQ4wdcZBuloBAHHhZCTMdodrpZBDpo5s8Y1JdEorCo6x5O3NUG7KG0vh7Hvz7GyZAWODwEs7cJKQeyVC5oTTBpc1PNtOF403tfCHnHLnWgKvQtfDWu1ZAu9gimsIAhQqpAbcz8IhH3K9jYMZBfoA6uerNfCHN75KxQSbKkFtKqwZDZD',
    validationSecret: 'testing'
  }),
  router: function(bot, request, callback) {

      var action = {
        name: (request.message.indexOf("/stats") === 0) ? "stats" : "speak",
        payload: {
          message: request.message
        }
      }

      var newContext = bot.dispatch(action, request)
      callback(newContext)
  }
};

// Design based on: https://expressjs.com/en/guide/routing.html
// Add ability to do module based loading like with Express.
var bot = new BotKit.Bot(config);

bot.use(function(action, request){

  var defaults = {
    messageCount: 0,
    wordCount: 0
  }

  var context = Object.assign({}, defaults, request.context)

  var messageCount = context.messageCount + 1;
  var wordCount = context.wordCount + request.message.split(" ").length;

  return Object.assign({}, context, {
    messageCount: messageCount,
    wordCount: wordCount
  })
})

bot.action('stats', function(payload, request){

  bot.speak({
    message: "Total Message Count: " + request.context.messageCount
  }, request)

  bot.speak({
    message: "Total Word Count: " + request.context.wordCount
  }, request)

  return request.context
})

bot.start();
