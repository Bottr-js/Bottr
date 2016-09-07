jest.unmock('../lib/session')

var Session = require('../lib/session')

// function Session(user, context, client) {
//   this.queue = queue()
//   this.queue.concurrency = 1
// }

test('creates internal queue', () => {
  var session = new Session()
  expect(session.queue).not.toBeNull()
});

test('sets internal queue concurrency to 1', () => {
  var session = new Session()
  expect(session.queue.concurrency).toEqual(1)
});

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
