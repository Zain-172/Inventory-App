import express from "express";
import Product from "../controller/product.js";

const counter_router = express.Router();

const productInstance = new Product();

counter_router.get("/", productInstance.getProduct);
counter_router.post("/increment", productInstance.incrementCounter);

export default counter_router;