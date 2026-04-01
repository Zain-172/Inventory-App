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

  if (!columnNames.has("type")) {
    db.prepare("ALTER TABLE sales ADD COLUMN type TEXT NOT NULL DEFAULT 'sale'").run();
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
        type = "sale",
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
        INSERT INTO sales (invoice_id, sale_date, salesman, total_amount, total_items, total_cost, tax, customer_id, customer, status, delivery_status, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          type
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
    const { period, date } = req.params;
    try {
      let rows;
      if (period === 'daily') {
      rows = db
        .prepare(
          `
  SELECT s.id, s.invoice_id, s.sale_date, s.salesman, s.total_amount, s.total_items, s.status, s.tax, s.delivery_status, si.barcode,
         si.product_name, si.quantity, si.price as price, s.customer, s.customer_id, s.type
  FROM sales s
  JOIN sale_items si ON s.id = si.sale_id
  WHERE s.sale_date = ?
  ORDER BY s.id DESC
`
        )
        .all(date);
      } else if (period === 'monthly') {
        rows = db
        .prepare(
          `
  SELECT s.id, s.invoice_id, s.sale_date, s.salesman, s.total_amount, s.total_items, s.status, s.tax, s.delivery_status, si.barcode,
         si.product_name, si.quantity, si.price as price, s.customer, s.customer_id, s.type
  FROM sales s
  JOIN sale_items si ON s.id = si.sale_id
  WHERE strftime('%Y-%m', s.sale_date) = ?
  ORDER BY s.id DESC
`
        )
        .all(date);
      } else if (period === 'annually') {
        rows = db
        .prepare(
          `
  SELECT s.id, s.invoice_id, s.sale_date, s.salesman, s.total_amount, s.total_items, s.status, s.tax, s.delivery_status, si.barcode,
         si.product_name, si.quantity, si.price as price, s.customer, s.customer_id, s.type
         FROM sales s
         JOIN sale_items si ON s.id = si.sale_id
         WHERE strftime('%Y', s.sale_date) = ?
          ORDER BY s.id DESC
`
        )
        .all(date);
      }
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
            type: row.type,
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
        .prepare("SELECT product_name, sum(quantity) as total_quantity, price FROM sale_items join sales on sale_items.sale_id = sales.id WHERE strftime('%Y', sale_date) = ? GROUP BY product_name")
        .all(date);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getSaleByDate = (req, res) => {
    const { date } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) FROM sales WHERE sale_date = ? and type = 'sale' group by sale_date")
        .all(date);
      res.json(rows[0]?.["sum(total_amount)"] || 0);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getSaleByMonth = (req, res) => {
    const { month } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) FROM sales WHERE strftime('%Y-%m', sale_date) = ? and type = 'sale'")
        .all(month);
      console.log("Fetched profit for month:", rows);
      res.json(rows[0]?.["sum(total_amount)"] || 0);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getSaleByYear = (req, res) => {
    const { year } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) FROM sales WHERE strftime('%Y', sale_date) = ? and type = 'sale'")
        .all(year);
      console.log("Fetched profit for year:", rows);
      res.json(rows[0]?.["sum(total_amount)"] || 0);
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
  updateSaleTax = (req, res) => {
    const { id } = req.params;
    const { tax } = req.body;

    const parsedTax = Number(tax);
    if (!Number.isFinite(parsedTax) || parsedTax < 0) {
      return res.status(400).json({ message: "Invalid tax value" });
    }

    try {
      const stmt = db.prepare("UPDATE sales SET tax = ? WHERE id = ?");
      const info = stmt.run(parsedTax, id);

      if (info.changes === 0) {
        return res.status(404).json({ message: "Sale not found" });
      }

      res.json({ message: "Sale tax updated", tax: parsedTax });
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
        .prepare("SELECT COUNT(id) as orders FROM sales WHERE sale_date = CURRENT_DATE and type = 'order'")
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
        .prepare("SELECT COALESCE(sum(total_amount), 0) as sale FROM sales WHERE sale_date = CURRENT_DATE and type = 'sale'")
        .get();
      res.json({ sale: row?.sale || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getProfitByDate = (req, res) => {
    const { date } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) - sum(total_cost) as profit FROM sales WHERE sale_date = ? and type = 'sale' group by sale_date")
        .all(date);
      console.log("Fetched profit for date:", rows);
      res.json(rows[0]?.profit || 0);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  getProfitByMonth = (req, res) => {
    const { month } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) - sum(total_cost) as profit FROM sales WHERE strftime('%Y-%m', sale_date) = ?")
        .all(month);
      console.log("Fetched profit for month:", rows);
      res.json(rows[0]?.profit || 0);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getProfitByYear = (req, res) => {
    const { year } = req.params;
    try {
      const rows = db
        .prepare("SELECT sum(total_amount) - sum(total_cost) as profit FROM sales WHERE strftime('%Y', sale_date) = ?")
        .all(year);
      console.log("Fetched profit for year:", rows);
      res.json(rows[0]?.profit || 0);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

}