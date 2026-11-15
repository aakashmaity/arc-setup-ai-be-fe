import { findActiveProducts } from "../repositories/productRepository.js";

export async function getProductCatalog({ limit, offset }) {
  const { products, total } = await findActiveProducts({ limit, offset });
  return { products, total, limit, offset };
}
