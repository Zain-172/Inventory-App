import db from "../Database/DB.js";

export default class Expense {
  constructor(id, title, description, amount, date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.amount = amount;
    this.date = date;
  }
  getExpenses = (req, res) => {
    try {
      const rows = db
        .prepare("SELECT expense_id, title, description, amount, expense_date FROM expense")
        .all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  insertExpense = (req, res) => {
    const { title, description, amount, date } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO expense (title, description, amount, expense_date) VALUES (?, ?, ?, ?)"
      );
      const info = stmt.run(title, description, amount, date);
      res
        .status(201)
        .json({ message: "Expense recorded", expenseId: info.lastInsertRowid });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
