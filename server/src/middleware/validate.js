// Wraps a zod schema into Express middleware. `source` selects which part of the
// request to validate ('body' by default; pass 'query' for query-string filters).
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.') || source}: ${issue.message}`)
        .join('; ');
      return res.status(400).json({ error: message });
    }

    req[source] = result.data;
    next();
  };
}
