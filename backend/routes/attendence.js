import express from "express";
import Attendence from "../controller/attendence.js";

const attendence_router = express.Router();
const attendenceInstance = new Attendence();

attendence_router.post("/", attendenceInstance.upsertAttendence);
attendence_router.get("/count-today", attendenceInstance.countAttendanceToday);
attendence_router.get("/by-date/:date", attendenceInstance.attendenceByDate);
attendence_router.get("/by-month/:month", attendenceInstance.attendenceByMonth);
attendence_router.get("/by-year/:year", attendenceInstance.attendenceByYear);
attendence_router.get("/:date", attendenceInstance.getAttendenceByDate);

export default attendence_router;
