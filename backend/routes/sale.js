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
sale_router.get("/by-date", (req, res) => {
    saleInstance.getSaleByDate(req, res);
});
sale_router.get("/cost-by-date", (req, res) => {
    saleInstance.getCostByDate(req, res)
})
sale_router.delete("/:id", (req, res) => {
    saleInstance.deleteSale(req, res);
});
sale_router.get("/products-sold-by-date", (req, res) => {
    saleInstance.getProductsSoldByDate(req, res);
});
sale_router.get("/products-sold-by-month", (req, res) => {
    saleInstance.getProductsSoldByMonth(req, res);
});
sale_router.get("/products-sold-by-year", (req, res) => {
    saleInstance.getProductsSoldByYear(req, res);
});

export default sale_router;