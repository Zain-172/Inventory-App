PRAGMA foreign_keys = ON;

---------------------------------------------------------
-- EXPENSE TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS expense (
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    expense_date TEXT NOT NULL
);

---------------------------------------------------------
-- PRODUCTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    cost_price REAL,
    stock REAL,
    date TEXT
);

---------------------------------------------------------
-- PRODUCTS HISTORY TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS products_history (
    id INTEGER,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL,
    cost_price REAL NOT NULL,
    date TEXT,
    action TEXT,
    PRIMARY KEY (id)
);

---------------------------------------------------------
-- RAW MATERIAL TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw_material (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(raw_id) REFERENCES products(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

---------------------------------------------------------
-- RAW MATERIAL HISTORY TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw_material_history (
    id INTEGER,
    raw_id INTEGER,
    product_id INTEGER,
    quantity REAL,
    date TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------------------------
-- SALES TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id TEXT NOT NULL UNIQUE,
    sale_date TEXT NOT NULL,
    salesman TEXT NOT NULL,
    total_amount REAL NOT NULL DEFAULT 0,
    total_items INTEGER NOT NULL DEFAULT 0,
    total_cost REAL NOT NULL DEFAULT 0,
    tax REAL NOT NULL DEFAULT 0,
    customer_id INTEGER,
    customer TEXT,
    status TEXT NOT NULL DEFAULT 'paid',
    delivery_status TEXT NOT NULL DEFAULT 'not_delivered'
);

---------------------------------------------------------
-- SALE ITEMS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS sale_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,

    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

---------------------------------------------------------
-- TRIGGER: RESTORE STOCK ON DELETE
---------------------------------------------------------

DROP TRIGGER IF EXISTS before_update_raw_material;

CREATE TRIGGER before_update_raw_material
BEFORE UPDATE ON raw_material
FOR EACH ROW
BEGIN
    INSERT INTO raw_material_history (
        id, raw_id, product_id, quantity, date
    ) VALUES (
        OLD.id, OLD.raw_id, OLD.product_id, OLD.quantity, OLD.date
    );
END;
DROP TRIGGER IF EXISTS reduce_inventory_after_sale;

CREATE TRIGGER reduce_inventory_after_sale
AFTER INSERT ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
END;
DROP TRIGGER IF EXISTS restore_stock_after_delete;

CREATE TRIGGER restore_stock_after_delete
AFTER DELETE ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock + OLD.quantity
    WHERE id = OLD.product_id;
END;
