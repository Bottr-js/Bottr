function MemoryStorage() {

  var memory = {
    users: {

    }
  }

  return function(bot) {

    bot.on('message_received', function(message, session, next) {

      session.getUserContext = function(defaults) {
        var context = memory.users[session.user] || {}
        return Object.assign({}, defaults || {}, context)
      }

      session.updateUserContext = function(newValues) {
        var context = memory.users[session.user] || {}
        memory.users[session.user] = Object.assign(context, newValues)
      }

      next()
    })
  }
}

module.exports = MemoryStorage
