const assert = require('assert')
const WitAi = require('node-wit')

function WitAIRouter(config) {
  assert(config.apiToken, 'No API Token was provided')

  return function(bot, request, callback) {

    var witAiActions = {}

    for (var actionName in bot.actions) {
      var action = bot.actions[actionName]
      witAiActions[actionName] = function(request, response) {
        var payload = Object.assign(request, response)
        var newContext = action(payload, request)
        return Promise.resolve(newContext)
      }
    }

    var wit = new WitAi({
      accessToken: config.apiToken,
      actions: witAiActions
    })

    wit.runActions(
             request.user.conversationID,
             request.message,
             request.context
    ).then(callback)
  }
}

module.exports = WitAIRouter
