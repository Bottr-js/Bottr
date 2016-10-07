jest.unmock('../lib/serve-webclient')

var serveWebclient = require('../lib/serve-webclient')

test('should serve webclient', () => {

  var req = {}
  var res = {
    sendFile: jest.fn()
  }

  serveWebclient(req, res)

  var path = (__dirname + '/webclient.html').replace("__tests__", "lib")
  expect(res.sendFile).toBeCalledWith(path)
});
