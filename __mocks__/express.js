var express = function() {
  return {
    get: jest.fn(),
    use: jest.fn()
  }
}

express.Router = jest.fn(function() {
  return {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn()
  }
})

express.static = jest.fn()

module.exports = express
