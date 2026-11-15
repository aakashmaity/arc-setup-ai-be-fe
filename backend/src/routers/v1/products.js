import { Router } from "express";
import { getProducts } from "../../controllers/productController.js";
import validate from "../../middlewares/validate.js";
import { productListQuerySchema } from "../../validators/productQuerySchema.js";

const productsRouter = Router();

productsRouter.get("/", validate(productListQuerySchema), getProducts);

export default productsRouter;
