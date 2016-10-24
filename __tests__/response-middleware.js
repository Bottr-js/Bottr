jest.unmock('../lib/response-middleware');

const ResponseMiddleware = require('../lib/response-middleware');

const res = {
  sendStatus: jest.fn(),
  status: jest.fn(),
  json: jest.fn(),
};

const req = {};
const next = jest.fn();

const middleware = new ResponseMiddleware();
middleware(req, res, next);

it('should send status code 200 on success', () => {
  res.success();
  expect(res.sendStatus).toBeCalledWith(200);
});

it('should send status code 400 on error', () => {
  res.error();
  expect(res.status).toBeCalledWith(400);
});

it('should send message on error', () => {
  res.error('Error');
  expect(res.json).toBeCalledWith({
    error: 'Error',
  });
});

it('should call next', () => {
  expect(next).toBeCalled();
});
