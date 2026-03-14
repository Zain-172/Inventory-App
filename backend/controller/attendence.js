import db from "../Database/DB.js";

export default class Attendence {
	getAttendenceByDate = (req, res) => {
		const { date } = req.params;
		try {
			const rows = db
				.prepare(
					"SELECT employee_id, date, status, time FROM attendence WHERE date = ?"
				)
				.all(date);
			res.json(rows);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	};

	upsertAttendence = (req, res) => {
		const { employee_id, date, status, time } = req.body;
		if (!employee_id || !date || !status || !time) {
			return res.status(400).json({ message: "Missing required fields" });
		}
		try {
			db.prepare(
				`INSERT INTO attendence (employee_id, date, status, time)
				 VALUES (?, ?, ?, ?)
				 ON CONFLICT(employee_id, date)
				 DO UPDATE SET status = excluded.status, time = excluded.time`
			).run(employee_id, date, status, time);

			res.status(200).json({ message: "Attendence saved" });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	};

	countAttendanceToday = (req, res) => {
		try {
			const rows = db.prepare(
				`SELECT count(id) FROM attendence WHERE date = CURRENT_DATE and status = 'Present'`
			).all();
			console.log("Attendance count for today:", rows);
			res.json(rows);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	};

	attendenceByDate = (req, res) => {
		const { date } = req.params;
		console.log("Fetching attendance for date:", date);
		try {
			const rows = db
				.prepare(
					`SELECT e.name, a.status, a.time
					 FROM attendence a
					 JOIN employees e ON a.employee_id = e.employee_id
					 WHERE a.date = ?`
				)
				.all(date);
			res.json(rows);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	};

	attendenceByMonth = (req, res) => {
		const { month } = req.params;
		console.log("Fetching attendance for month:", month);
		try {
			const rows = db
				.prepare(
					`SELECT e.name, a.date, a.status, a.time
					 FROM attendence a
					 JOIN employees e ON a.employee_id = e.employee_id
					 WHERE strftime('%Y-%m', a.date) = ?`
				)
				.all(month);
			res.json(rows);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	};

	attendenceByYear = (req, res) => {
		const { year } = req.params;
		console.log("Fetching attendance for year:", year);
		try {
			const rows = db
				.prepare(
					`SELECT e.name, a.date, a.status, a.time
					 FROM attendence a
					 JOIN employees e ON a.employee_id = e.employee_id
					 WHERE strftime('%Y', a.date) = ?`
				)
				.all(year);
			res.json(rows);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	};
}
