var CoffeeScript = require('coffee-script');
CoffeeScript.register();
var Botkit = require('botkit');
var Hubot = require('hubot');

function HubotBot(hubot) {

  // Create a core botkit bot
  var hubot_botkit = Botkit.core({})

  // customize the bot definition, which will be used when new connections
  // spawn!
  hubot_botkit.defineBot(function(botkit, config) {

      var bot = {
          botkit: botkit,
          config: config || {},
          utterances: botkit.utterances,
      };

      bot.startConversation = function(message, cb) {
          botkit.startConversation(this, message, cb);
      };

      bot.send = function(message, cb) {

        message.res.send(message.text)

        if (cb) {
          cb()
        }
      };

      bot.reply = function(src, resp, cb) {

        src.res.reply(resp)

        if (cb) {
          cb()
        }
      };

      bot.findConversation = function(message, cb) {

          botkit.debug('CUSTOM FIND CONVO', message.user, message.channel);
          // - Load from context store

          if (cb) {
            cb();
          }
      };

      console.log("Attaching listeners For \"" + hubot.name + "\"...")

      hubot.hear(/./, function(res){
        var message = {
            res: res,
            text: res.message,
            user: res.user
        };

        hubot_botkit.receiveMessage(bot, message);
      })

      hubot.respond(/./, function(res) {
        var message = {
            res: res,
            text: res.message,
            user: res.user
        };

        hubot_botkit.receiveMessage(bot, message);
      })

      console.log("\"" + hubot.name + "\" started...")

      hubot.run()
  })

  return hubot_botkit
}

function Neurotin(controller) {

  controller.on('message_received', function(bot, message) {

    controller.storage.users.get(message.user, function(err, context) {
        // Default values for if this is the first time
        // communicating with the bot
        var defaults = {
          messageCount: 0,
          wordCount: 0
        }

        // Merge current context with the defaults.
        var context = Object.assign({}, defaults, context)

        // Increment the message count and
        // calculate the new number of words the user has sent
        //
        // FIXME: Why do we need to text.text on an event but not a listener
        var messageCount = context.messageCount + 1;
        var wordCount = context.wordCount + message.text.text.split(" ").length;

        // Merge the new statistics into the context
        // and return it back to the bot
        controller.storage.users.save({
          id: message.user,
          context: Object.assign({}, context, {
            messageCount: messageCount,
            wordCount: wordCount
          })
        }, function(){});
    });
  })

  controller.hears(['\/stats'], ['message_received'], function(bot, message) {
      controller.storage.users.get(message.user, function(err, context) {
        // Send the total number of messages to the
        // user
        bot.reply(message, "Total Message Count: " + context.messageCount)

        // Send the total number of words to the
        // user
        bot.speak(message, "Total Word Count: " +context.wordCount)

        //
        // We don't do anything to the context
        // so we just return it
        //return request.context
      });
  });

  controller.hears([/.+/], ['message_received'], function(bot, message) {
      bot.reply(message, message.text);
  });
}
//
// /* This class handles the framework for taking input
//  from a client passing it to a router and then triggering
//  an action for an application.
// */
//
// const assert = require('assert');
//
// /**
// Constructs a new Bot with a delegate.
//
//  - parameter delegate: The Delgate for the bot.
//  */
// function Bot(config) {
//
//   assert(config, "No config was provided.")
//   assert(config.client, "No client set on configuration.")
//   assert(config.router, "No router set on configuration.")
//
//   /* Connect all the pipework and ask for both the
//      client and router from the application */
//   this.client = config.client;
//   this.router = config.router.bind(config);
//   this.contextStore = config.contextStore
//
//   /* Storage for actions and middleware */
//   this.actions = {};
//   this.middlewares = [];
//
//   /* Register default speak action */
//   this.action("send", this.send.bind(this))
// }
//
// Bot.prototype.action = function(name, func) {
//   this.actions[name] = func;
// }
//
// Bot.prototype.dispatch = function(action, request) {
//   var func = this.actions[action.name];
//   assert(func, 'Action ' + action.name + ' not registered')
//
//   this.middlewares.forEach(function(middleware){
//     request.context = middleware(action, request)
//   })
//
//   return func(action.payload, request)
// }
//
// Bot.prototype.send = function(payload, request) {
//   this.client.send(payload.text, request.user)
//   return request.context
// }
//
// Bot.prototype.use = function(middleware) {
//   this.middlewares.push(middleware);
// }
//
// /**
//  Call this to start the bot.
//  */
// Bot.prototype.start = function() {
//   this.startContextStore(this.startClient.bind(this));
// };
//
// Bot.prototype.startContextStore = function(callback) {
//   if (this.contextStore) {
//     this.contextStore.start(callback)
//   } else {
//     callback()
//   }
// }
//
// Bot.prototype.startClient = function() {
//   assert(this.client.start, "Client doesn't implement start method.")
//
//   // Start the client so the bot can listen to input.
//   this.client.start(this)
// }
//
// Bot.prototype.didRecieveMessage = function(message, user, callback) {
//
//   var contextHandler = function(context) {
//
//     var request = {
//       context: context,
//       message: message,
//       user: user
//     }
//
//     this.router(this, request, this.createRouterDidFinishHandler(user, callback).bind(this))
//   }
//
//   var context = this.contextForUser(user, contextHandler.bind(this))
// }
//
// Bot.prototype.createRouterDidFinishHandler = function(user, callback) {
//   return function (newContext) {
//
//     this.storeContextForUser(newContext, user)
//
//     if (callback) {
//       callback()
//     }
//   }
// }

console.log('Starting Neurotin....')

//adapterPath, adapterName, enableHttpd, botName, botAlias
var hubot = Hubot.loadBot(null, 'shell', true, 'echobot', null)
var bot = new HubotBot(hubot);
var neurotin = new Neurotin(bot)

bot.spawn()
