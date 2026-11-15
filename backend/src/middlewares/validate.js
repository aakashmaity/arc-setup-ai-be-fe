export default function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      return response.status(400).json({
        error: "Invalid query parameters.",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    response.locals.validatedQuery = result.data;
    next();
  };
}
