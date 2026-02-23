const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Internal server error" : err.message || "Request failed";

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
  });
};

export default errorHandler;
