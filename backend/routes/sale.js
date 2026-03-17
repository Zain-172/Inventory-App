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
sale_router.get("/with-items/:period/:date", (req, res) => {
    saleInstance.getSaleWithItems(req, res);
});
sale_router.get("/cost-by-date", (req, res) => {
    saleInstance.getCostByDate(req, res)
})
sale_router.put("/:id/status", (req, res) => {
    saleInstance.updateSaleStatus(req, res);
});
sale_router.put("/:id/delivery-status", (req, res) => {
    saleInstance.updateSaleDeliveryStatus(req, res);
});
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
sale_router.get("/sale-today", (req, res) => {
    saleInstance.getSaleToday(req, res);
});
sale_router.get("/orders-today", (req, res) => {
    saleInstance.getOrdersToday(req, res);
});
sale_router.get("/profit-today", (req, res) => {
    saleInstance.getProfitToday(req, res);
});
sale_router.get("/period/:from/:to", (req, res) => {
    saleInstance.getSalesDuringPeriod(req, res);
});
sale_router.get("/profit-date/:date", (req, res) => {
    saleInstance.getProfitByDate(req, res);
});
sale_router.get("/profit-month/:month", (req, res) => {
    saleInstance.getProfitByMonth(req, res);
});
sale_router.get("/profit-year/:year", (req, res) => {
    saleInstance.getProfitByYear(req, res);
});
sale_router.get("/sale-date/:date", (req, res) => {
    saleInstance.getSaleByDate(req, res);
});
sale_router.get("/sale-month/:month", (req, res) => {
    saleInstance.getSaleByMonth(req, res);
});
sale_router.get("/sale-year/:year", (req, res) => {
    saleInstance.getSaleByYear(req, res);
});
export default sale_router;