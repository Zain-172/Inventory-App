import db from "../Database/DB.js";

export default class Employee {
    constructor(id, name, position, salary, phone, address = "", date_updated = new Date().toISOString().split("T")[0]) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.salary = salary;
        this.phone = phone;
        this.address = address;
        this.date_updated = date_updated;
    }
    getEmployees = (req, res) => {
        try {
            const rows = db
                .prepare("SELECT employee_id as id, name, position, salary, phone, address FROM employees")
                .all();
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    insertEmployee = (req, res) => {
        const { name, position, salary, phone, address, date_updated } = req.body;
        try {
            const stmt = db.prepare("INSERT INTO employees (name, position, salary, phone, address, date_updated) VALUES (?, ?, ?, ?, ?, ?)");
            const info = stmt.run(name, position, salary, phone, address, date_updated);
            res.json({ id: info.lastInsertRowid, name, position, salary, phone, address, date_updated });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    deleteEmployee = (req, res) => {
        const { id } = req.params;
        try {
            const stmt = db.prepare("DELETE FROM employees WHERE employee_id = ?");
            stmt.run(id);
            res.status(200).json({ message: "Employee deleted" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    updateEmployee = (req, res) => {
        const { id } = req.params;
        const { name, position, date_updated, salary, phone, address } = req.body;
        try {
            const stmt = db.prepare("UPDATE employees SET name = ?, position = ?, phone = ?, date_updated = ?, salary = ?, address = ? WHERE employee_id = ?");
            stmt.run(name, position, phone, date_updated, salary, address, id);
            res.status(200).json({ message: "Employee updated" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}