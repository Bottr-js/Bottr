/* This class handles the framework for taking input
 from a client passing it to a router and then triggering
 an action for an application.
*/

const assert = require('assert');

/**
Constructs a new Bot with a delegate.

 - parameter delegate: The Delgate for the bot.
 */
function Bot(delegate) {

  assert(delegate, "No delegate was provided.")
  assert(delegate.clientForBot, "Delegate doesn't implement clientForBot method.")
  assert(delegate.routerForBot, "Delegate doesn't implement routerForBot method.")
  assert(delegate.triggerActionWithName, "Delegate doesn't implement triggerActionWithName method.")

  /* Connect all the pipework and ask for both the
     client and router from the application */
  this.delegate = delegate
}

/**
 Call this to start the bot.
 */
Bot.prototype.start = function() {

  // Start the client so the bot can listen to input.
  var client = this.delegate.clientForBot(this)
  assert(client.start, "Client doesn't implement start method.")

  client.start(this)
};

Bot.prototype.didRecieveMessage = function(message, user, callback) {

  var sessionID = this.sessionIDForUser(user)
  var context = this.contextForUser(user)

  var request = {
    sessionID: sessionID,
    context: context,
    message: message
  }

  var router = this.delegate.routerForBot(this)
  assert(router.route, "Router doesn't implement route method.")

  router.route(this, request, this.createRouterDidFinishHandler(callback).bind(this))
}

Bot.prototype.sessionIDForUser = function(user) {
  if (this.delegate.sessionIDForUser) {
    return this.delegate.sessionIDForUser(user)
  } else {
    return null
  }
}

Bot.prototype.contextForUser = function(user) {
  if (this.delegate.contextForUser) {
    return this.delegate.contextForUser(user)
  } else {
    return {}
  }
}

Bot.prototype.createRouterDidFinishHandler = function(callback) {
  return function (newContext) {

    if (this.delegate.storeContext) {
      this.delegate.storeContext(newContext, sessionID)
    }

    callback()
  }
}

Bot.prototype.triggerActionWithName = function(name, event) {
  return this.delegate.triggerActionWithName(name, event)
}

module.exports = Bot
