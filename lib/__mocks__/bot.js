var mock = {
  use: jest.fn(),
  connectToSocket: jest.fn(),
  trigger: jest.fn()
}

module.exports = function() {
  return mock
}
