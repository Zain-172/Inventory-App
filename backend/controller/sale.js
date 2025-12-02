import db from "../Database/DB.js";
import SaleItem from "./SaleItems.js";
import { Mutex } from "async-mutex";

const saleItemModel = new SaleItem();
const saleMutex = new Mutex();

export default class Sale {
  insertSale = async (req, res) => {
    const release = await saleMutex.acquire();
    try {
      const {
        invoice_id,
        sale_date,
        salesman,
        total_amount,
        total_items,
        items,
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Sale items required" });
      }

      const insertSaleStmt = db.prepare(`
        INSERT INTO sales (invoice_id, sale_date, salesman, total_amount, total_items)
        VALUES (?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction(() => {
        const saleInfo = insertSaleStmt.run(
          invoice_id,
          sale_date,
          salesman,
          total_amount,
          total_items
        );
        const sale_id = saleInfo.lastInsertRowid;

        for (const item of items) {
          saleItemModel.insertItem(sale_id, item);
        }
        return sale_id;
      });

      const sale_id = transaction();

      res.status(201).json({ message: "Sale recorded successfully", sale_id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      release();
    }
  };
  getSales = (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM sales").all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getSaleWithItems = (req, res) => {
    try {
      const rows = db
        .prepare(
          `
  SELECT s.id, s.invoice_id, s.sale_date, s.salesman, s.total_amount, s.total_items, si.item_id,
         si.product_name, si.quantity, si.price as price
  FROM sales s
  JOIN sale_items si ON s.id = si.sale_id
  ORDER BY s.id DESC
`
        )
        .all();

      const groupedSales = [];

      const map = new Map();

      for (const row of rows) {
        if (!map.has(row.invoice_id)) {
          const saleObj = {
            id: row.id,
            invoice_id: row.invoice_id,
            sale_date: row.sale_date,
            salesman: row.salesman,
            total_amount: row.total_amount,
            total_items: row.total_items,
            items: [],
          };
          map.set(row.invoice_id, saleObj);
          groupedSales.push(saleObj);
        }

        map.get(row.invoice_id).items.push({
          id: row.item_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price,
        });
      }

      console.log(groupedSales);
      res.json(groupedSales);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getSaleByDate = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) FROM sales WHERE sale_date = ? group by sale_date")
        .all(date);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  deleteSale = (req, res) => {
    const { id } = req.params;
    try {
      const deleteItemsStmt = db.prepare("DELETE FROM sale_items WHERE sale_id = ?");
      deleteItemsStmt.run(id);
      const deleteSaleStmt = db.prepare("DELETE FROM sales WHERE id = ?");
      deleteSaleStmt.run(id);
      res.json({ message: "Sale deleted successfully" });
      console.log(`Sale with id ${id} deleted successfully`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}