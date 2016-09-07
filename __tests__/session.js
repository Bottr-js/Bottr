jest.unmock('../lib/session')

var Session = require('../lib/session')

// function Session(user, context, client) {
//   this.queue = queue()
//   this.queue.concurrency = 1
//
//   this.user = user
//   this.context = context
//   this.client = client
// }
//
// Session.prototype.send = function(text) {
//
//   var session = this
//
//   this.queue.push(function(cb) {
//     session.startTyping()
//
//     var averageWordsPerMinute = 600
//     var averageWordsPerSecond = averageWordsPerMinute / 60
//     var averageWordsPerMillisecond = averageWordsPerSecond / 1000
//     var totalWords = text.split(" ").length
//     var typingTime = totalWords / averageWordsPerMillisecond
//
//     setTimeout(function() {
//       session.client.send(session, text)
//       cb()
//     }, typingTime)
//   });
//
//   this.queue.start()
// }
//
// Session.prototype.startTyping = function() {
//   this.client.startTyping(this)
// }
//
// Session.prototype.updateContext = function(newValues) {
//   this.context = Object.assign(this, newValues)
// }

test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});
