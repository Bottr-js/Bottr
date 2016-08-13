var BotKit = require('./lib/botkit');

var config = {
  client: new BotKit.FacebookMessengerClient({
    appSecret: '770739fb5821713a8418148a16c352ef',
    pageAccessToken: 'EAAQ4wdcZBuloBAHHhZCTMdodrpZBDpo5s8Y1JdEorCo6x5O3NUG7KG0vh7Hvz7GyZAWODwEs7cJKQeyVC5oTTBpc1PNtOF403tfCHnHLnWgKvQtfDWu1ZAu9gimsIAhQqpAbcz8IhH3K9jYMZBfoA6uerNfCHN75KxQSbKkFtKqwZDZD',
    validationSecret: 'testing'
  }),
  router: function(bot, request, callback) {

      var action = {
        "type": (request.message.indexOf("/history") === 0) ? "history" : "speak",
        "request": request,
        "message": request.message
      }

      var newContext = bot.dispatch(action)
      callback(newContext)
  },
  dispatch: function(action) {

      switch (action) {
        case "speak":
        this.client.speak(action.message, action.request.user)
        return

        case "history":
        this.client.speak("I will show your history of echos", action.request.user)
        return
      }


      return action.request.context
  }
};

var bot = new BotKit.Bot(config);
bot.start();
