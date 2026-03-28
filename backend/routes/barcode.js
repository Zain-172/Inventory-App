import express from "express";
import { printLabel, getPrinter } from "../controller/barcode.js";

const barcode_router = express.Router();

barcode_router.post("/generate", printLabel);
barcode_router.get("/printers", async (req, res) => {
    const printers = await getPrinter();
    console.log("Printers fetched:", printers);
    res.json(printers);
});

export default barcode_router;
