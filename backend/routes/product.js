import express from "express";
import Product from "../controller/product.js";

const counter_router = express.Router();

const productInstance = new Product();

counter_router.get("/", productInstance.getProduct);
counter_router.delete("/:id", productInstance.deleteProduct);
counter_router.post("/add-product", productInstance.insertProduct);

export default counter_router;