var stream = {
  on: jest.fn()
}

module.exports = jest.fn(function() {
  return {
    stream: jest.fn(function() {
      return stream
    }),
    post: jest.fn()
  }
})
