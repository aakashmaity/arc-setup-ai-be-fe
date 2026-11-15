import { Router } from "express";
import productsRouter from "./products.js";

const v1Router = Router();

v1Router.use("/products", productsRouter);

export default v1Router;
