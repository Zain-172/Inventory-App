import db from "../Database/DB.js";

export default class Customer {
  constructor(
    id,
    customer,
    phone,
    address,
    type,
    date_added
  ) {
    this.id = id;
    this.customer = customer;
    this.phone = phone;
    this.address = address;
    this.type = type;
    this.date_added = date_added;
  }

  // ================================
  // GET ALL CUSTOMERS
  // ================================
  getCustomers = (req, res) => {
    try {
      const rows = db
        .prepare(
          "SELECT id, customer, phone, address, type FROM customers"
        )
        .all();

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // ================================
  // GET ONE CUSTOMER BY ID
  // ================================
  getCustomerById = (req, res) => {
    const { id } = req.params;

    try {
      const row = db
        .prepare(
          "SELECT id, customer, phone, address, type, date_added FROM customers WHERE id = ?"
        )
        .get(id);

      if (!row) return res.status(404).json({ message: "Customer not found" });

      res.json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // ================================
  // SEARCH CUSTOMERS (Auto-complete)
  // search?query=ali
  // ================================
  searchCustomers = (req, res) => {
    const { query } = req.query;

    try {
      const rows = db
        .prepare(
          "SELECT id, customer, phone, address, type FROM customers WHERE customer LIKE ? LIMIT 10"
        )
        .all(`%${query}%`);

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // ================================
  // INSERT CUSTOMER
  // ================================
  insertCustomer = (req, res) => {
    const { customer, phone, address, type } = req.body;

    try {
      const stmt = db.prepare(
        "INSERT INTO customers (customer, phone, address, type) VALUES (?, ?, ?, ?)"
      );

      const info = stmt.run(customer, phone, address, type);

      res.status(201).json({
        message: "Customer added",
        customerId: info.lastInsertRowid,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // ================================
  // UPDATE CUSTOMER
  // ================================
  updateCustomer = (req, res) => {
    const { id } = req.params;
    const { customer, phone, address, type } = req.body;

    try {
      const stmt = db.prepare(
        `UPDATE customers 
         SET customer = ?, phone = ?, address = ?, type = ?
         WHERE id = ?`
      );

      const info = stmt.run(customer, phone, address, type, id);

      if (info.changes === 0)
        return res.status(404).json({ message: "Customer not found" });

      res.json({ message: "Customer updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // ================================
  // DELETE CUSTOMER
  // ================================
  deleteCustomer = (req, res) => {
    const { id } = req.params;

    try {
      const stmt = db.prepare("DELETE FROM customers WHERE id = ?");
      const info = stmt.run(id);

      if (info.changes === 0)
        return res.status(404).json({ message: "Customer not found" });

      res.json({ message: "Customer deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  countCustomers = (req, res) => {
  try {
    const row = db
      .prepare("SELECT COUNT(id) AS count FROM customers WHERE type = 'normal'")
      .get();

    res.json({ count: row.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

  countShop = (req, res) => {
    try {
      const row = db
        .prepare("SELECT COUNT(id) AS count FROM customers WHERE type != 'normal'")
        .get();
      res.json({ count: row.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
