import db from "../Database/DB.js";

export default class Material {
  constructor(id, title, description, amount, date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.amount = amount;
    this.date = date;
  }
  getMaterials = (req, res) => {
    try {
      const rows = db
        .prepare("SELECT id, title, description, amount, date FROM materials")
        .all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getDailyMaterials = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare(
          "SELECT sum(amount) as total FROM material WHERE date = ? group by date"
        )
        .all(date);
      res.json(rows);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  insertMaterial = (req, res) => {
    const { title, description, amount, date } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO material (title, description, amount, date) VALUES (?, ?, ?, ?)"
      );
      const info = stmt.run(title, description, amount, date);
      res
        .status(201)
        .json({ message: "Material recorded", MaterialId: info.lastInsertRowid });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteMaterial = (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare("DELETE FROM material WHERE id = ?");
      stmt.run(id);
      res.status(200).json({ message: "Material deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateMaterial = (req, res) => {
    const { id } = req.params;
    const { title, description, amount, date } = req.body;
    try {
      const stmt = db.prepare(
        "UPDATE material SET title = ?, description = ?, amount = ?, date = ? WHERE id = ?"
      );
      const info = stmt.run(title, description, amount, date, id);
      if (info.changes === 0) {
        res.status(404).json({ message: "Material not found" });
      } else {
        res.json({ message: "Material updated" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}