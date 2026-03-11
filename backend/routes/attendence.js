import express from "express";
import Attendence from "../controller/attendence.js";

const attendence_router = express.Router();
const attendenceInstance = new Attendence();

attendence_router.get("/:date", attendenceInstance.getAttendenceByDate);
attendence_router.post("/", attendenceInstance.upsertAttendence);

export default attendence_router;
