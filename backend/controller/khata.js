import db from "../Database/DB.js";

export default class Khata {
  constructor() {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS khata_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        opening_balance REAL NOT NULL DEFAULT 0,
        current_balance REAL NOT NULL DEFAULT 0,
        note TEXT,
        date_added TEXT NOT NULL DEFAULT (date('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`
    ).run();
  }

  getKhataAccounts = (req, res) => {
    try {
      const rows = db
        .prepare(
          "SELECT id, name, phone, address, opening_balance, current_balance, note FROM khata_accounts ORDER BY id DESC"
        )
        .all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  insertKhataAccount = (req, res) => {
    const { name, phone, address, opening_balance = 0, note = "" } = req.body;

    try {
      const stmt = db.prepare(
        "INSERT INTO khata_accounts (name, phone, address, opening_balance, current_balance, note) VALUES (?, ?, ?, ?, ?, ?)"
      );
      const info = stmt.run(
        name,
        phone || "",
        address || "",
        Number(opening_balance) || 0,
        Number(opening_balance) || 0,
        note
      );

      res.status(201).json({
        id: info.lastInsertRowid,
        name,
        phone: phone || "",
        address: address || "",
        opening_balance: Number(opening_balance) || 0,
        current_balance: Number(opening_balance) || 0,
        note,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateKhataAccount = (req, res) => {
    const { id } = req.params;
    const { name, phone, address, current_balance = 0, note = "" } = req.body;

    try {
      const stmt = db.prepare(
        "UPDATE khata_accounts SET name = ?, phone = ?, address = ?, current_balance = ?, note = ?, updated_at = datetime('now') WHERE id = ?"
      );
      const info = stmt.run(
        name,
        phone || "",
        address || "",
        Number(current_balance) || 0,
        note,
        id
      );

      if (info.changes === 0) {
        return res.status(404).json({ message: "Khata account not found" });
      }

      res.json({ message: "Khata account updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteKhataAccount = (req, res) => {
    const { id } = req.params;

    try {
      const stmt = db.prepare("DELETE FROM khata_accounts WHERE id = ?");
      const info = stmt.run(id);

      if (info.changes === 0) {
        return res.status(404).json({ message: "Khata account not found" });
      }

      res.json({ message: "Khata account deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  countKhataAccounts = (req, res) => {
    try {
      const row = db.prepare("SELECT COUNT(*) AS count FROM khata_accounts").get();
      res.json({ count: row.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
