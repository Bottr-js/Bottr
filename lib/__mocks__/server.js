module.exports = jest.fn(function() {
  return {
    listen: jest.fn(),
    use: jest.fn()
  }
})
