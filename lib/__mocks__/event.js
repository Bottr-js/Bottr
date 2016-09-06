module.exports = function(eventName, remainingListeners, args) {
  return {
    eventName: eventName,
    remainingListeners: remainingListeners,
    args: args,
    next: jest.fn(function(callback) {
      callback()
    })
  }
}
