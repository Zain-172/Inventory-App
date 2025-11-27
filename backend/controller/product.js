import Database from "better-sqlite3";
const db = new Database("./Database/Database.db");

export default class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
  getProduct = (req, res) => {
    try {
      const row = db.prepare("SELECT * FROM products").all();
      console.log(row);
      if (!row) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  insertProduct = (req, res) => {
    const { name, price, stock } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)"
      );
      const info = stmt.run(name, price, stock);
      res
        .status(201)
        .json({ message: "Product created", productId: info.lastInsertRowid });
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
    const { name, price, stock } = req.body;
    try {
      const stmt = db.prepare(
        "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?"
      );
      const info = stmt.run(name, price, stock, id);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}