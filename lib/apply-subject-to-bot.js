function applySubjectToBot(bot, subject){
  var newBot = {}
  var subjectMethods = ['send', 'reply', 'startConversation', 'sayFirst']

  subjectMethods.forEach(function (key) {

    var originalFunction = bot[key]

    newBot[key] = function() {
      var args = Array.prototype.concat.apply([subject], arguments)
      originalFunction.apply(this, args)
    }
  })

  return Object.assign({}, bot, newBot)
}

module.exports = applySubjectToBot
