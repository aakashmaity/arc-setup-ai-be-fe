import { getProductCatalog } from "../services/productService.js";

export async function getProducts(_request, response) {
  const catalog = await getProductCatalog(response.locals.validatedQuery);
  response.json(catalog);
}
