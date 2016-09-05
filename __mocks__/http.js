module.exports = {
  Server: function(app) {
    return {
      app: app,
      listen: jest.fn()
    }
  }
}
