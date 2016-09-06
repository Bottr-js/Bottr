module.exports = function(remainingListeners, args) {
  return {
    remainingListeners: remainingListeners,
    args: args,
    next: jest.fn(function(callback) {
      callback()
    })
  }
}
