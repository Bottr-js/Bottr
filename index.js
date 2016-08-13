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
        "type": (request.message.indexOf("/stats") === 0) ? "stats" : "speak",
        "message": request.message
      }

      var newContext = bot.dispatch(action, request)
      callback(newContext)
  },
  dispatch: function(action, request) {

      var defaults = {
        messageCount: 0,
        wordCount: 0
      }

      var context = Object.assign(defaults, request.context)
      var messageCount = context.messageCount + 1;
      var wordCount = context.wordCount + request.message.split(" ").length;

      switch (action.type) {
        case "speak":
        this.client.speak(action.message, request.user)
        break

        case "stats":
        this.client.speak("Total Message Count: " + messageCount, request.user)
        this.client.speak("Total Word Count: " + wordCount, request.user)
        break
      }

      return Object.assign(request.context, {
        messageCount: messageCount,
        wordCount: wordCount
      })
  }
};

var bot = new BotKit.Bot(config);
bot.start();
