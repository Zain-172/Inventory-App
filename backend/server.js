import express from "express";
import cors from "cors";
import product_router from "./routes/product.js";
import sale_router from "./routes/sale.js";
import raw_material_router from "./routes/raw_material.js";
import expense_router from "./routes/expense.js";
import report_router from "./routes/report.js";
import employee_router from "./routes/employee.js";
import customer_router from "./routes/customer.js";
import material_router from "./routes/material.js";
import employee_accounts_router from "./routes/employee_accounts.js";
import attendence_router from "./routes/attendence.js";
import khata_router from "./routes/khata.js";
import opt_router from "./routes/otp.js";
import sign_up_router from "./routes/sign_up.js";
import login_router from "./routes/login.js";
import barcode_router from "./routes/barcode.js";
import context_router from "./routes/context.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/product", product_router);
app.use("/sale", sale_router);
app.use("/raw-material", raw_material_router);
app.use("/expense", expense_router);
app.use("/report", report_router);
app.use("/employee", employee_router);
app.use("/customer", customer_router);
app.use("/material", material_router);
app.use("/employee-accounts", employee_accounts_router);
app.use("/attendence", attendence_router);
app.use("/khata", khata_router);
app.use("/otp", opt_router);
app.use("/sign-up", sign_up_router);
app.use("/login", login_router);
app.use("/barcode", barcode_router);
app.use("/context", context_router);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
