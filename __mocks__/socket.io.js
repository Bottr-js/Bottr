var mock = {
  of: jest.fn(function() {
    return this
  }),
  on: jest.fn()
}

module.exports = function() {
  return mock
}
