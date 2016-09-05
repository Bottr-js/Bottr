var socket = {
  on: jest.fn()
}

var mock = {
  of: jest.fn(function() {
    return this
  }),
  on: jest.fn(function(event, callback) {
    callback(socket)
  })
}

module.exports = function() {
  return mock
}
