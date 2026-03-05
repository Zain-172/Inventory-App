import db from "../Database/DB.js";

export default class Product {
  constructor(id, name, price, stock, date, type) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.date = date;
    this.type = type;
  }
  getProduct = (req, res) => {
    try {
      const row = db.prepare("SELECT id, name, cost_price, stock, date, type FROM products").all();
      if (!row) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getInventory = (req, res) => {
    try {
      const rows = db
        .prepare(
          "SELECT id, name, sum(stock) as total_stock, cost_price, max(date) as date_updated, type from products GROUP by name"
        )
        .all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getStockByDate = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare(
          "SELECT sum(stock * cost_price) from products WHERE date = ? group by date"
        )
        .all(date);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getStockHistoryDate = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare(
          "SELECT name, stock, cost_price FROM products_history WHERE stock > 0 and date = ? "
        )
        .all(date);
        res.json(rows);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error"})
    }
  }
  getStockHistoryMonth = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare(
          "SELECT name, stock, cost_price, date FROM products_history WHERE stock > 0 and strftime('%Y-%m', date) = ? "
        )
        .all(date);
        res.json(rows);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error"})
    }
  }
  getStockHistoryYear = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare(
          "SELECT name, stock, cost_price, date FROM products_history WHERE stock > 0 and strftime('%Y', date) = ? "
        )
        .all(date);
        res.json(rows);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error"})
    }
  }
  insertProduct = (req, res) => {
    const { name, cost_price, stock, date, type, action } = req.body;
    console.log("Received data: ", { name, cost_price, stock, date, type, action });
    try {
      const stmt1 = db.prepare(`
      INSERT INTO products (name, cost_price, stock, date, type)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(name, type) DO UPDATE
      SET stock = stock + excluded.stock,
          cost_price = excluded.cost_price,
          date = excluded.date,
          type = excluded.type
    `);
      stmt1.run(name, cost_price, stock, date, type);

      const stmt2 = db.prepare(`
      INSERT INTO products_history (name, cost_price, stock, date, type, action)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
      stmt2.run(name, cost_price, stock, date, type, action);

      res.status(201).json({ message: "Product created/updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteProduct = (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare("DELETE FROM products WHERE id = ?");
      const info = stmt.run(id);
      if (info.changes === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, stock, type } = req.body;
    try {
      const stmt = db.prepare(
        "UPDATE products SET name = ?, cost_price = ?, stock = ?, type = ? WHERE id = ?"
      );
      const info = stmt.run(name, price, stock, type, id);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
