function ResponseMiddleware() {
  return (req, res, next) => {
    res.success = () => {
      res.sendStatus(200);
    };

    res.error = (message) => {
      res.status(400);
      res.json({
        error: message,
      });
    };

    next();
  };
}

module.exports = ResponseMiddleware;
