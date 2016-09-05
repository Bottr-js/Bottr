var mock = {
  use: jest.fn(),
  connectToSocket: jest.fn()
}

module.exports = function() {
  return mock
}
