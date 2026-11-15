export default function notFoundMiddleware(_request, response) {
  response.status(404).json({ error: "Not found." });
}
