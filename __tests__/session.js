jest.unmock('../lib/session')
jest.unmock('queue')

var Session = require('../lib/session')

var client = {
  send: jest.fn(),
  startTyping: jest.fn()
}

it('should create internal queue', () => {
  var session = new Session()
  expect(session.queue).not.toBeNull()
})

it('should set internal queue concurrency to 1', () => {
  var session = new Session()
  expect(session.queue.concurrency).toEqual(1)
})

it('should simulate typing of message', () => {
  var session = new Session(null, null, client)
  session.send('text')
  expect(client.startTyping).toBeCalled()
})

it('should send message via client after simulating typing', (done) => {

  var originalImp = client.startTyping
  client.startTyping = jest.fn(function() {
    done()
  })

  var session = new Session(null, null, client)
  session.send('text')

  client.startTyping = originalImp
})

it('should tell client to simulate typing when session is told to start simulating typing', () => {
  var session = new Session(null, null, client)
  session.startTyping()
  expect(client.startTyping).toBeCalled()
})
