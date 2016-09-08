module.exports = function() {
  return {
    push: jest.fn(function(callback) {
      callback()
    }),
    start: jest.fn()
  }
}
