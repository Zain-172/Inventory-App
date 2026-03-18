import express from "express";
import { printLabel } from "../controller/barcode.js";

const barcode_router = express.Router();

barcode_router.post("/generate", printLabel);

export default barcode_router;
