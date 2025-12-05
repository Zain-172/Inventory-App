import db from "../Database/DB.js";

export default class SaleItem {
  constructor() {
    this.insertStmt = db.prepare(`
      INSERT INTO sale_items
      (sale_id, product_name, quantity, price, product_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    this.getBySaleIdStmt = db.prepare(`
      SELECT * FROM sale_items WHERE sale_id = ?
    `);
    this.deleteBySaleIdStmt = db.prepare(`
      DELETE FROM sale_items WHERE sale_id = ?
    `);
  }

  insertItem(sale_id, item) {
    console.log("Inserting Sale Item:", { sale_id, ...item });
    return this.insertStmt.run(
      sale_id,
      item.product,
      item.quantity,
      item.sale_price,
      item.id
    );
  }

  getItemsBySaleId(sale_id) {
    return this.getBySaleIdStmt.all(sale_id);
  }

  deleteItemsBySaleId(sale_id) {
    return this.deleteBySaleIdStmt.run(sale_id);
  }
}
