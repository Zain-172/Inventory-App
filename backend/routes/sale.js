import express from "express";
import Sale from "../controller/sale.js";

const sale_router = express.Router();
const saleInstance = new Sale();

sale_router.post("/add-sale", (req, res) => {
    saleInstance.insertSale(req, res);
});
sale_router.get("/", (req, res) => {
    saleInstance.getSales(req, res);
});
sale_router.get("/with-items", (req, res) => {
    saleInstance.getSaleWithItems(req, res);
});

export default sale_router;