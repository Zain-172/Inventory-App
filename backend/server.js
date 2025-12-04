import express from "express";
import cors from "cors";
import product_router from "./routes/product.js";
import sale_router from "./routes/sale.js";
import raw_material_router from "./routes/raw_material.js";
import expense_router from "./routes/expense.js";
import report_router from "./routes/report.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/product", product_router);
app.use("/sale", sale_router);
app.use("/raw-material", raw_material_router);
app.use("/expense", expense_router);
app.use("/report", report_router);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
