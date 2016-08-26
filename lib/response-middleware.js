function ResponseMiddleware() {
  return function(req, res, next) {

    res.success = function() {
      res.json({})
    }

    res.error = function(message) {
      res.json({
        error: message
      })
    }

    next()
  }
}

module.exports = ResponseMiddleware
