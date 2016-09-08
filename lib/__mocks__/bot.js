var Server = require('./server')

var mock = {
  on: jest.fn(),
  use: jest.fn(),
  connectToSocket: jest.fn(),
  trigger: jest.fn(),
  listen: jest.fn(function() {
    return new Server()
  })
}

module.exports = function() {
  return mock
}
