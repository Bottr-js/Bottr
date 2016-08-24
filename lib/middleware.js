var Context = require('./context');
var applySubjectToBot = require('./apply-subject-to-bot');

function MiddlewareEndpoint(storage, endpoint) {

  var createCompletionCallback = function(context, next) {
    return function() {
      context.save()
      next()
    }
  }

  var createMiddlewareAdapter = function(middleware) {

    return function(bot, utterance, next) {

      var context = new Context(storage, utterance)
      var callback = createCompletionCallback(context, next)

      context.fetch().then(function() {
        var appliedBot = applySubjectToBot(bot, utterance)
        middleware(appliedBot, utterance, context, callback)
      })
    }
  }

  this.use = function(middleware) {
    endpoint.use(createMiddlewareAdapter(middleware))
  }
}

function Middleware(storage, middleware) {
  this.receive = new MiddlewareEndpoint(storage, middleware.receive)
  this.send = new MiddlewareEndpoint(storage, middleware.send)
}

module.exports = Middleware
