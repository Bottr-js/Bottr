jest.unmock('../lib/event')

var Event = require('../lib/event')

test('should call handler', () => {
  var handler = jest.fn()
  var event = new Event([handler], [])

  event.next(jest.fn())

  expect(handler).toBeCalled()
})

test('should call next handler when previous handler doesn\'t handle event', () => {
  var handler = function(next) {
    next()
  }
  var handler2 = jest.fn()
  var event = new Event([handler, handler2], [])

  event.next(jest.fn())

  expect(handler2).toBeCalled()
})

test('should call unhandled callback if no handler handles event', () => {
  var callback = jest.fn()
  var event = new Event([], [])

  event.next(callback)

  expect(callback).toBeCalled()
})
