function MemoryStorage() {

  var memory = {
    users: {

    },
    conversations: {

    },
    account: {

    }
  }

  return function(bot) {

    bot.on('message_received', function(message, session, next) {

      session.getUserContext = function(defaults) {
        var context = memory.users[session.user] || {}
        return Object.assign({}, defaults || {}, context)
      }

      session.getConversationContext = function(defaults) {
        var context = memory.conversations[session.conversation] || {}
        return Object.assign({}, defaults || {}, context)
      }

      session.getAccountContext = function(defaults) {
        var context = memory.accounts[session.account] || {}
        return Object.assign({}, defaults || {}, context)
      }

      session.updateUserContext = function(newValues) {
        var context = memory.users[session.user] || {}
        memory.users[session.user] = Object.assign(context, newValues)
      }

      session.updateConversationContext = function(newValues) {
        var context = memory.conversations[session.conversation]  || {}
        memory.users[session.conversation] = Object.assign(context, newValues)
      }

      session.updateAccountContext = function(newValues) {
        var context = memory.accounts[session.account] || {}
        memory.accounts[session.account] = Object.assign(context, newValues)
      }

      next()
    })
  }
}

module.exports = MemoryStorage
