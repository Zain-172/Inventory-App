import db from "../Database/DB.js";
import SaleItem from "./SaleItems.js";
import { Mutex } from "async-mutex";

const saleItemModel = new SaleItem();
const saleMutex = new Mutex();
const allowedStatuses = ["paid", "pending", "half_payment"];
const allowedDeliveryStatuses = ["delivered", "not_delivered"];

const ensureSalesColumns = () => {
  const columns = db.prepare("PRAGMA table_info(sales)").all();
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("tax")) {
    db.prepare("ALTER TABLE sales ADD COLUMN tax REAL NOT NULL DEFAULT 0").run();
  }

  if (!columnNames.has("delivery_status")) {
    db.prepare("ALTER TABLE sales ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'not_delivered'").run();
  }
};

ensureSalesColumns();

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
        total_cost,
        tax = 0,
        items,
        customer,
        customer_id,
        status,
        delivery_status = "not_delivered",
      } = req.body;
      console.log("Received sale data:", req.body);

      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Sale items required" });
      }

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }

      if (!allowedDeliveryStatuses.includes(delivery_status)) {
        return res.status(400).json({ message: "Invalid delivery status" });
      }

      const insertSaleStmt = db.prepare(`
        INSERT INTO sales (invoice_id, sale_date, salesman, total_amount, total_items, total_cost, tax, customer_id, customer, status, delivery_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction(() => {
        const saleInfo = insertSaleStmt.run(
          invoice_id,
          sale_date,
          salesman,
          total_amount,
          total_items,
          total_cost,
          tax,
          customer_id,
          customer,
          status,
          delivery_status,
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
    const { date } = req.query;
    try {
      const rows = db.prepare("SELECT * FROM sales WHERE sale_date = ?").all(date);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getSaleWithItems = (req, res) => {
    const { from, to } = req.query;
    try {
      const rows = db
        .prepare(
          `
  SELECT s.id, s.invoice_id, s.sale_date, s.salesman, s.total_amount, s.total_items, s.status, s.tax, s.delivery_status, si.barcode,
         si.product_name, si.quantity, si.price as price, s.customer, s.customer_id
  FROM sales s
  JOIN sale_items si ON s.id = si.sale_id
  WHERE s.sale_date BETWEEN ? AND ?
  ORDER BY s.id DESC
`
        )
        .all(from, to);
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
            status: row.status,
            tax: row.tax,
            delivery_status: row.delivery_status,
            customer: row.customer,
            customer_id: row.customer_id,
            items: [],
          };
          map.set(row.invoice_id, saleObj);
          groupedSales.push(saleObj);
        }

        map.get(row.invoice_id).items.push({
          product_name: row.product_name,
          barcode: row.barcode,
          quantity: row.quantity,
          price: row.price,
        });
      }

      res.json(groupedSales);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getProductsSoldByDate = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare("SELECT product_name, sum(quantity) as total_quantity, price FROM sale_items join sales on sale_items.sale_id = sales.id WHERE sale_date = ? GROUP BY product_name")
        .all(date);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getProductsSoldByMonth = (req, res) => {
    const { date } = req.query;
    console.log("Received date for month query: ", date);
    try {
      const rows = db
        .prepare("SELECT product_name, sum(quantity) as total_quantity, price FROM sale_items join sales on sale_items.sale_id = sales.id WHERE strftime('%Y-%m', sale_date) = ? GROUP BY product_name")
        .all(date);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getProductsSoldByYear = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare("SELECT product_name, sum(quantity) as total_quantity, price FROM sale_items join sales on sale_items.sale_id = sales.id WHERE strf('%Y', sale_date) = ? GROUP BY product_name")
        .all(date);
      res.json(rows);
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
  getCostByDate = (req, res) => {
    const { date } = req.query;
    try {
      const rows = db
        .prepare("SELECT sum(total_cost) FROM sales WHERE sale_date = ? group by sale_date")
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
  updateSaleStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid sale status" });
    }

    try {
      const stmt = db.prepare("UPDATE sales SET status = ? WHERE id = ?");
      const info = stmt.run(status, id);

      if (info.changes === 0) {
        return res.status(404).json({ message: "Sale not found" });
      }

      res.json({ message: "Sale status updated", status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  updateSaleDeliveryStatus = (req, res) => {
    const { id } = req.params;
    const { delivery_status } = req.body;

    if (!allowedDeliveryStatuses.includes(delivery_status)) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    try {
      const stmt = db.prepare("UPDATE sales SET delivery_status = ? WHERE id = ?");
      const info = stmt.run(delivery_status, id);

      if (info.changes === 0) {
        return res.status(404).json({ message: "Sale not found" });
      }

      res.json({ message: "Sale delivery status updated", delivery_status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getProfitToday = (req, res) => {
    try {
      const row = db
        .prepare("SELECT COALESCE(sum(total_amount - total_cost), 0) as profit FROM sales WHERE sale_date = CURRENT_DATE")
        .get();
      res.json({ profit: row?.profit || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getOrdersToday = (req, res) => {
    try {
      const row = db
        .prepare("SELECT COUNT(id) as orders FROM sales WHERE sale_date = CURRENT_DATE")
        .get();
      res.json({ orders: row?.orders || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getSaleToday = (req, res) => {
    try {
      const row = db
        .prepare("SELECT COALESCE(sum(total_amount), 0) as sale FROM sales WHERE sale_date = CURRENT_DATE")
        .get();
      res.json({ sale: row?.sale || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getProfitDuringPeriod = (req, res) => {
    const { from, to } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount - total_cost) as profit FROM sales WHERE sale_date BETWEEN ? AND ?")
        .all(from, to);
      console.log("Fetched profit during period:", rows);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getSalesDuringPeriod = (req, res) => {
    const { from, to } = req.params;
    console.log("Received dates for sales during period:", from, to);
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) as total_sales FROM sales WHERE sale_date BETWEEN ? AND ?")
        .all(from, to);
      console.log("Fetched sales during period:", rows);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}