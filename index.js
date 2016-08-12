var BotKit = require('./lib/botkit');

var delegate = {
  clientForBot: function (bot) {
    return new BotKit.CLIClient()
  },
  routerForBot: function (bot) {
    return {
      route: function(bot, request, callback) {

        var event = {
          "request": request,
          "message": request.message
        }

        var newContext = bot.triggerActionWithName("speak", event)
        callback(newContext)
      }
    }
  },
  triggerActionWithName: function(name, event) {
      var client = this.clientForBot(bot)
      client.speak(event.message)
      return event.request.context
  }
};

var bot = new BotKit.Bot(delegate);
bot.start();
