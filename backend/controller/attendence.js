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
}
