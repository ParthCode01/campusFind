function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message;

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Request body must contain valid JSON.";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((error) => error.message).join(" ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid value provided for an item field.";
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "An unexpected server error occurred." : message,
  });
}

module.exports = { errorHandler, notFound };
