jest.unmock('../lib/session')
jest.unmock('queue')

var Session = require('../lib/session')

var client = {
  send: jest.fn(),
  startTyping: jest.fn()
}

test('should create internal queue', () => {
  var session = new Session()
  expect(session.queue).not.toBeNull()
})

test('should set internal queue concurrency to 1', () => {
  var session = new Session()
  expect(session.queue.concurrency).toEqual(1)
})

test('should simulate typing of message', () => {
  var session = new Session(null, null, client)
  session.send('text')
  expect(client.startTyping).toBeCalled()
})

test('should send message via client after simulating typing', (done) => {

  var originalImp = client.startTyping
  client.startTyping = jest.fn(function() {
    done()
  })

  var session = new Session(null, null, client)
  session.send('text')

  client.startTyping = originalImp
})

test('should tell client to simulate typing when session is told to start simulating typing', () => {
  var session = new Session(null, null, client)
  session.startTyping()
  expect(client.startTyping).toBeCalled()
})
