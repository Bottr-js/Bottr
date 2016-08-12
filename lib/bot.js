/* This class handles the framework for taking input
 from a client passing it to a router and then triggering
 an action for an application.
*/

const assert = require('assert');

/**
Constructs a new Bot with a delegate.

 - parameter delegate: The Delgate for the bot.
 */
function Bot(config) {

  assert(config, "No config was provided.")
  assert(config.client, "No client set on configuration.")
  assert(config.router, "No router set on configuration.")
  assert(config.dispatch, "No dispatch set on configuration.")

  /* Connect all the pipework and ask for both the
     client and router from the application */
  this.config = config
  this.client = this.config.client;
  this.router = this.config.router.bind(config);
  this.dispatch = this.config.dispatch.bind(config);
}

/**
 Call this to start the bot.
 */
Bot.prototype.start = function() {
  assert(this.client.start, "Client doesn't implement start method.")

  // Start the client so the bot can listen to input.
  this.client.start(this)
};

Bot.prototype.didRecieveMessage = function(message, user, callback) {

  var sessionID = this.sessionIDForUser(user)
  var context = this.contextForUser(user)

  var request = {
    sessionID: sessionID,
    context: context,
    message: message
  }

  this.router(this, request, this.createRouterDidFinishHandler(callback).bind(this))
}

Bot.prototype.sessionIDForUser = function(user) {
  if (this.config.sessionIDForUser) {
    return this.config.sessionIDForUser(user)
  } else {
    return null
  }
}

Bot.prototype.contextForUser = function(user) {
  if (this.config.contextForUser) {
    return this.config.contextForUser(user)
  } else {
    return {}
  }
}

Bot.prototype.createRouterDidFinishHandler = function(callback) {
  return function (newContext) {

    if (this.config.storeContext) {
      this.config.storeContext(newContext, sessionID)
    }

    callback()
  }
}

module.exports = Bot
