import Product from "../schema/product.js";

export async function findActiveProducts({ limit, offset }) {
  const filter = { isActive: true };
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total };
}
