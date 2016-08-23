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

        src.res.reply(src.text)

        if (cb) {
          cb()
        }
      };

      bot.findConversation = function(message, cb) {

          botkit.debug('CUSTOM FIND CONVO', message.user, message.channel);
          // for (var t = 0; t < botkit.tasks.length; t++) {
          //     for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
          //         if (
          //             botkit.tasks[t].convos[c].isActive() &&
          //             botkit.tasks[t].convos[c].source_message.user == message.user
          //         ) {
          //             botkit.debug('FOUND EXISTING CONVO!');
          //             cb(botkit.tasks[t].convos[c]);
          //             return;
          //         }
          //     }
          // }

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

function Neurotin(bot) {


  bot.hears(['hello','hi'], 'message_received', function(bot, message) {
      bot.reply(message, "Hello.");
  });
}

console.log('Starting Neurotin....')

//adapterPath, adapterName, enableHttpd, botName, botAlias
var hubot = Hubot.loadBot(null, 'shell', true, 'echobot', null)
var bot = new HubotBot(hubot);

bot.spawn()

var neurotin = new Neurotin(bot)

// var config = {
//   contextStore: new BotKit.MemoryContextStore(),
//   router: function(bot, request, callback) {
//
//       // Trigger stats action if the user sends "/stats"
//       // otherwise repeat what they said by invoking
//       // the "speak" action and passing the message
//       // in the payload
//       var action = {
//         name: (request.message.indexOf("/stats") === 0) ? "stats" : "speak",
//         payload: {
//           message: request.message
//         }
//       }
//
//       // Dispatch the action specified above
//       var newContext = bot.dispatch(action, request)
//
//       // The router is finished - trigger the callback
//       // to let the bot know we're done and give it the
//       // context to store for next time
//       callback(newContext)
//   }
// };
//
// // Create the bot with our configuration
// var bot = new BotKit.Bot(config);
//
// // Define some middleware which updates the statistics
// // for a user as they communicate with the bot
// bot.use(function(action, request){
//
//   // Default values for if this is the first time
//   // communicating with the bot
//   var defaults = {
//     messageCount: 0,
//     wordCount: 0
//   }
//
//   // Merge current context with the defaults.
//   var context = Object.assign({}, defaults, request.context)
//
//   // Increment the message count and
//   // calculate the new number of words the user has sent
//   var messageCount = context.messageCount + 1;
//   var wordCount = context.wordCount + request.message.split(" ").length;
//
//   // Merge the new statistics into the context
//   // and return it back to the bot
//   return Object.assign({}, context, {
//     messageCount: messageCount,
//     wordCount: wordCount
//   })
// })
//
// // Define our "stats" action
// bot.action('stats', function(payload, request){
//
//   // Send the total number of messages to the
//   // user
//   bot.speak({
//     message: "Total Message Count: " + request.context.messageCount
//   }, request)
//
//   // Send the total number of words to the
//   // user
//   bot.speak({
//     message: "Total Word Count: " + request.context.wordCount
//   }, request)
//
//   // We don't do anything to the context
//   // so we just return it
//   return request.context
// })
