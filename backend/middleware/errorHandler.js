function errorHandler(err, req, res, next) {
  const statusCode =
    err?.statusCode ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  const message = err?.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
