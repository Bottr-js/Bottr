function ResponseMiddleware() {
  return function(req, res, next) {

    res.success = function() {
      res.sendStatus(200)
    }

    res.error = function(message) {
      res.status(400)
      res.json({
        error: message
      })
    }

    next()
  }
}

module.exports = ResponseMiddleware
