import express from "express";
import Context from "../controller/context.js";

const context_router = express.Router();
const context = new Context();

context_router.post("/get-product-context", (req, res) => {
    const products = req.body;
    const response = context.sendContextEmail("zaina.azhar2005@gmail.com", "Products", products);
});
context_router.post("/get-history-context", (req, res) => {
    const history = req.body;
    console.log("Received history context:", history);
    const response = context.sendContextEmail("zaina.azhar2005@gmail.com", "Product History", history);
});
export default context_router;