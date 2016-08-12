var BotKit = require('./lib/botkit');

var config = {
  client: new BotKit.FacebookMessengerClient(),
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
      this.client.speak(action.message)
      return action.request.context
  }
};

var bot = new BotKit.Bot(config);
bot.start();
