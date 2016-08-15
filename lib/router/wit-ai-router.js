const assert = require('assert')
const WitAi = require('node-wit')

function WitAIRouter(config) {
  assert(config.apiToken, 'No API Token was provided')

  return function(bot, request, callback) {

    var witAiActions = {}

    for (var actionName in bot.actions) {
      var action = bot.actions[actionName]
      witAiActions = function(request, response) {
        var payload = Object.assign(request, response)
        var newContext = action(payload, request)
        return Promise.resolve(newContext)
      }
    }

    var wit = new Wit({
      accessToken: config.apiToken,
      witAiActions,
    })

    wit.runActions(
             request.user.conversationID,
             request.message,
             request.context
    ).then((newContext) => {
      callback(newContext)
      console.log('Waiting for next user messages');
    })
    .catch((err) => {
      console.error('Oops! Got an error from Wit: ', err.stack || err);
    })
  }
}

module.exports = WitAIRouter
