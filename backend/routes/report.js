import express from 'express';
import { generateReport } from '../controller/report.js';

const report_router = express.Router();

report_router.post('/generate', generateReport);

export default report_router;