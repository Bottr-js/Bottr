var BotKit = require('./lib/botkit');

var config = {
  client: new BotKit.FacebookMessengerClient({
    appSecret: '770739fb5821713a8418148a16c352ef',
    validationSecret: 'testing',
    pageAccessToken: 'EAAQ4wdcZBuloBAHHhZCTMdodrpZBDpo5s8Y1JdEorCo6x5O3NUG7KG0vh7Hvz7GyZAWODwEs7cJKQeyVC5oTTBpc1PNtOF403tfCHnHLnWgKvQtfDWu1ZAu9gimsIAhQqpAbcz8IhH3K9jYMZBfoA6uerNfCHN75KxQSbKkFtKqwZDZD'
  }),
  router: function(bot, request, callback) {

      var action = {
        "type": "speak",
        "request": request,
        "message": request.message
      }

      var newContext = bot.dispatch(action)
      callback(newContext)
  },
  dispatch: function(action) {
      this.client.speak(action.message, action.request.user)
      return action.request.context
  }
};

var bot = new BotKit.Bot(config);
bot.start();
