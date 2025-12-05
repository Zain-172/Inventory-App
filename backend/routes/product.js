import express from "express";
import Product from "../controller/product.js";

const counter_router = express.Router();

const productInstance = new Product();

counter_router.get("/", productInstance.getProduct);
counter_router.delete("/:id", productInstance.deleteProduct);
counter_router.post("/add-product", productInstance.insertProduct);
counter_router.get("/stock-by-date", productInstance.getStockByDate);
counter_router.get("/inventory", productInstance.getInventory);
counter_router.get("/stock-history-date", productInstance.getStockHistoryDate);
counter_router.get("/stock-history-month", productInstance.getStockHistoryMonth);
counter_router.get("/stock-history-year", productInstance.getStockHistoryYear);

export default counter_router;