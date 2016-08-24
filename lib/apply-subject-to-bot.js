function applySubjectToBot(bot, subject){
  var subjectMethods = ['reply', 'startConversation', 'sayFirst']

  for (var x in subjectMethods) {
    bot[x] = function() {
      var args = Array.prototype.concat.apply([subject], arguments)
      bot[x]().apply(this, args)
    }
  }

  return bot
}

module.exports = applySubjectToBot
