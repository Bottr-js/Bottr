function MemoryStorage() {

  this.memory = {
    users: {

    },
    conversations: {

    },
    accounts: {

    }
  }

  return function(bot) {

    bot.on('message_received', function(message, session, next) {

      session.getUserContext = function(defaults) {
        var context = this.memory.users[session.user] || {}
        return Object.assign({}, defaults || {}, context)
      }.bind(this)

      session.getConversationContext = function(defaults) {
        var context = this.memory.conversations[session.conversation] || {}
        return Object.assign({}, defaults || {}, context)
      }.bind(this)

      session.getAccountContext = function(defaults) {
        var context = this.memory.accounts[session.account] || {}
        return Object.assign({}, defaults || {}, context)
      }.bind(this)

      session.updateUserContext = function(newValues) {
        var context = this.memory.users[session.user] || {}
        this.memory.users[session.user] = Object.assign(context, newValues)
      }.bind(this)

      session.updateConversationContext = function(newValues) {
        var context = this.memory.conversations[session.conversation]  || {}
        this.memory.conversations[session.conversation] = Object.assign(context, newValues)
      }.bind(this)

      session.updateAccountContext = function(newValues) {
        var context = this.memory.accounts[session.account] || {}
        this.memory.accounts[session.account] = Object.assign(context, newValues)
      }.bind(this)

      next()

    }.bind(this))

    return this

  }.bind(this)
}

module.exports = MemoryStorage
