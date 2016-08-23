var CoffeeScript = require('coffee-script');
CoffeeScript.register();

var Botkit = require('botkit');
var Hubot = require('hubot');
//
// // Configure our Bot
// // - It will store contextual infomation in memory
// // - It will communicate to the user via Facebook Messenger
// // - It defines a simple router
// var config = {
//   contextStore: new BotKit.MemoryContextStore(),
//   client: new BotKit.FacebookMessengerClient({
//
//     // Get our keys from the Enviromental Variables
//     appSecret: process.env.FB_APP_SECRET,
//     pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN,
//     validationSecret: process.env.FB_VALIDATION_SECRET
//   }),
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
//
// // Start the bot which will start it
// // listening for input from a client
// bot.start();
