import express from 'express';
import {
	generateAttendenceReport,
	generateReport,
	getRawMaterialPurchasingReportByDate,
	getRawMaterialPurchasingReportByMonth,
	getRawMaterialPurchasingReportByYear,
} from '../controller/report.js';

const report_router = express.Router();

report_router.post('/generate', generateReport);
report_router.post('/generate-attendance', generateAttendenceReport);
report_router.get('/raw-material-purchasing-date', getRawMaterialPurchasingReportByDate);
report_router.get('/raw-material-purchasing-month', getRawMaterialPurchasingReportByMonth);
report_router.get('/raw-material-purchasing-year', getRawMaterialPurchasingReportByYear);

export default report_router;