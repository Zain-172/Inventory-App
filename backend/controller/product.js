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


  incrementCounter = (req, res) => {
    counter += 1;
    res.json({ counter });
  }
  }