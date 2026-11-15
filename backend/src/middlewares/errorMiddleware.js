export default function errorMiddleware(error, _request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const status =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 500
      ? error.status
      : 500;

  if (status === 500) {
    console.error(error);
  }

  let message = error.message;
  if (error.type === "entity.parse.failed") {
    message = "Request body must be valid JSON.";
  } else if (error.type === "entity.too.large") {
    message = "Request body exceeds the 10kb limit.";
  } else if (status === 500) {
    message = "Internal server error.";
  }

  response.status(status).json({ error: message });
}
