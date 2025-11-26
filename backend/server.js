import express from "express";
import cors from "cors";
import counter_router from "./routes/counter.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/counter", counter_router);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
