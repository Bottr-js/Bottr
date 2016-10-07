var queue = require('queue');

function Session(bot, user, client) {
  this.bot = bot
  this.queue = queue()
  this.queue.concurrency = 1

  this.user = user
  this.client = client
}

Session.prototype.send = function(text, attachment) {

  var session = this

  this.queue.push(function(cb) {
    session.startTyping()

    if (text) {
      var averageWordsPerMinute = 600
      var averageWordsPerSecond = averageWordsPerMinute / 60
      var averageWordsPerMillisecond = averageWordsPerSecond / 1000
      var totalWords = text.split(" ").length
      var typingTime = totalWords / averageWordsPerMillisecond
    } else {
      var typingTime = 0
    }

    setTimeout(function() {
      session.client.send(session, text, attachment)
      cb()
    }, typingTime)
  });

  this.queue.start()
}

Session.prototype.startTyping = function() {
  this.client.startTyping(this)
}

Session.prototype.startTopic = function(topicID) {
  console.log("Started Topic " + topicID)
  this.updateUserContext({
    currentTopic: topicID
  })
}

Session.prototype.finishTopic = function() {
  console.log("Finished Topic")
  this.updateUserContext({
    currentTopic: undefined
  })
}

Session.prototype.getUserContext = function(defaults) {
  var context = this.bot.memory.users[this.user] || {}
  return Object.assign({}, defaults || {}, context)
}

Session.prototype.updateUserContext = function(newValues) {
  var context = this.bot.memory.users[this.user] || {}
  this.bot.memory.users[this.user] = Object.assign(context, newValues)
}

module.exports = Session
