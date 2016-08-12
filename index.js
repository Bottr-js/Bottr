var BotKit = require('./lib/botkit');

var config = {
  client: new BotKit.CLIClient(),
  router: {
      route: function(bot, request, callback) {

        var event = {
          "request": request,
          "message": request.message
        }

        var newContext = bot.triggerActionWithName("speak", event)
        callback(newContext)
      }
  },
  triggerActionWithName: function(name, event) {
      this.client.speak(event.message)
      return event.request.context
  }
};

var bot = new BotKit.Bot(config);
bot.start();
