import express from 'express';
import { generateAttendenceReport, generateReport } from '../controller/report.js';

const report_router = express.Router();

report_router.post('/generate', generateReport);
report_router.post('/generate-attendance', generateAttendenceReport);

export default report_router;