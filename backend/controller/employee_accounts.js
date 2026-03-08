import db from "../Database/DB.js";

export default class EmployeeAccounts {
    constructor(id, employee_id, amount, date, reason) {
        this.id = id;
        this.employee_id = employee_id;
        this.amount = amount;
        this.date = date;
        this.reason = reason;
    }

    getEmployeeAccounts = (req, res) => {
        try {
            const rows = db
                .prepare("SELECT id, employee_id, amount, date, reason FROM employee_accounts")
                .all();
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    insertEmployeeAccount = (req, res) => {
        const { employee_id, amount, date, reason } = req.body;
        try {
            const stmt = db.prepare("INSERT INTO employee_accounts (employee_id, amount, date, reason) VALUES (?, ?, ?, ?)");
            const info = stmt.run(employee_id, amount, date, reason);
            res.json({ id: info.lastInsertRowid, employee_id, amount, date, reason });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    deleteEmployeeAccount = (req, res) => {
        const { id } = req.params;
        try {
            const stmt = db.prepare("DELETE FROM employee_accounts WHERE id = ?");
            stmt.run(id);
            res.status(200).json({ message: "Employee account deleted" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    updateEmployeeAccount = (req, res) => {
        const { id } = req.params;
        const { employee_id, amount, date, reason } = req.body;
        try {
            const stmt = db.prepare("UPDATE employee_accounts SET employee_id = ?, amount = ?, date = ?, reason = ? WHERE id = ?");
            stmt.run(employee_id, amount, date, reason, id);
            res.status(200).json({ message: "Employee account updated" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}