import express from "express";
import { getCounter, incrementCounter } from "../controller/counter.js";

const counter_router = express.Router();

counter_router.get("/", getCounter);
counter_router.post("/increment", incrementCounter);

export default counter_router;