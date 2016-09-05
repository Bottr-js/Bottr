var socket = {
  on: jest.fn()
}

module.exports = function() {
  return {
    of: jest.fn(function() {
      return this
    }),
    on: jest.fn(function(event, callback) {
      callback(socket)
    })
  }
}
