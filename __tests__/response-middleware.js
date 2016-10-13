jest.unmock('../lib/response-middleware')

var ResponseMiddleware = require('../lib/response-middleware')

var res = {
  sendStatus: jest.fn(),
  status: jest.fn(),
  json: jest.fn()
}

var req = {}
var next = jest.fn()

var middleware = new ResponseMiddleware()
middleware(req, res, next)

test('should send status code 200 on success', () => {
  res.success()
  expect(res.sendStatus).toBeCalledWith(200)
})

test('should send status code 400 on error', () => {
  res.error()
  expect(res.status).toBeCalledWith(400)
})

test('should send message on error', () => {
  res.error('Error')
  expect(res.json).toBeCalledWith({
    error: 'Error'
  })
})

test('should call next', () => {
  expect(next).toBeCalled()
})
