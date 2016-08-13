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
  this.contextStore = this.config.contextStore
}

/**
 Call this to start the bot.
 */
Bot.prototype.start = function() {
  this.startContextStore(this.startClient.bind(this));
};

Bot.prototype.startContextStore = function(callback) {
  if (this.contextStore) {
    this.contextStore.start(callback)
  } else {
    callback()
  }
}

Bot.prototype.startClient = function() {
  assert(this.client.start, "Client doesn't implement start method.")

  // Start the client so the bot can listen to input.
  this.client.start(this)
}

Bot.prototype.didRecieveMessage = function(message, user, callback) {

  var contextHandler = function(context) {
    
    var request = {
      context: context,
      message: message,
      user: user
    }

    this.router(this, request, this.createRouterDidFinishHandler(user, callback).bind(this))
  }

  var context = this.contextForUser(user, contextHandler.bind(this))
}

Bot.prototype.createRouterDidFinishHandler = function(user, callback) {
  return function (newContext) {

    this.storeContextForUser(newContext, user)

    if (callback) {
      callback()
    }
  }
}

Bot.prototype.contextForUser = function(user, callback) {
  if (this.contextStore) {
    this.getContextForUser(user, callback);
  } else {
    callback({})
  }
}

Bot.prototype.getContextForUser = function(user, callback) {
  this.contextStore.get("conversation_" + user.conversationID, function(err, reply) {
    if (reply) {
      callback(reply);
    } else {
      callback({});
    }
  })
}

Bot.prototype.storeContextForUser = function(newContext, user) {
  if (this.contextStore) {
    this.contextStore.set("conversation_" + user.conversationID, newContext)
  }
}

module.exports = Bot
