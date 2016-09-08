jest.unmock('../lib/memory-storage')

var Bot = require('../lib/bot')
var MemoryStorage = require('../lib/memory-storage')

var bot = new Bot()

var session = {
  user: "1",
  conversation: "1",
  account: "1"
}
var next = jest.fn()

bot.on = jest.fn(function(event, handler) {
  handler({}, session, next)
})

var storage = new MemoryStorage()(bot)

it('should allow message_received events to carry along event chain', () => {
  expect(next).toBeCalled()
})

it('should fetch user context', () => {

  storage.memory = {
      users: {
        "1": {
          "Hello": "World"
        }
      }
  }

  var context =  session.getUserContext()

  expect(context).toEqual({
    "Hello": "World"
  })
})

it('should fetch conversation context', () => {

  storage.memory = {
      conversations: {
        "1": {
          "Hello": "World"
        }
      }
  }

  var context =  session.getConversationContext()

  expect(context).toEqual({
    "Hello": "World"
  })
})

it('should fetch account context', () => {

  storage.memory = {
      accounts: {
        "1": {
          "Hello": "World"
        }
      }
  }

  var context = session.getAccountContext()

  expect(context).toEqual({
    "Hello": "World"
  })
})

it('should store user context', () => {

  storage.memory = {
      users: {}
  }

  session.updateUserContext({
    "Hello": "World"
  })

  expect(storage.memory.users["1"]).toEqual({
    "Hello": "World"
  })
})

it('should store conversation context', () => {

  storage.memory = {
      conversations: {}
  }

  session.updateConversationContext({
    "Hello": "World"
  })

  expect(storage.memory.conversations["1"]).toEqual({
    "Hello": "World"
  })
})

it('should store account context', () => {

  storage.memory = {
      accounts: {}
  }

  session.updateAccountContext({
    "Hello": "World"
  })

  expect(storage.memory.accounts["1"]).toEqual({
    "Hello": "World"
  })
})
