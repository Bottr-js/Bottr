jest.unmock('../lib/session')
jest.unmock('queue')

var Session = require('../lib/session')

var client = {
  send: jest.fn(),
  startTyping: jest.fn()
}

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


test('should simulate typing of message', () => {
  var session = new Session()
  expect(clietn.startTyping).toBeCalled()
});

test('should send message via client', () => {
  var session = new Session(null, {}, client)
  session.send('text')
  expect(client.send).toBeCalled()
});

test('should tell client to simulate typing when session is told to start simulating typing', () => {
  var session = new Session(null, {}, client)
  session.startTyping()
  expect(client.startTyping).toBeCalled()
});
