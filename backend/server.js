import express from "express";
import cors from "cors";
import product_router from "./routes/product.js";
import sale_router from "./routes/sale.js";
import raw_material_router from "./routes/raw_material.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/product", product_router);
app.use("/sale", sale_router);
app.use("/raw-material", raw_material_router);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
