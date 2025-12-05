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
    name TEXT NOT NULL UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0.0,
    machinery REAL NOT NULL DEFAULT 0.0,
    labour REAL NOT NULL DEFAULT 0.0,
    date_added TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

---------------------------------------------------------
-- RAW MATERIAL HISTORY TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw_material_history (
    id INTEGER,
    name TEXT,
    quantity REAL,
    price REAL,
    machinery REAL,
    labour REAL,
    description TEXT,
    date_added TEXT,
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
    total_cost REAL NOT NULL DEFAULT 0
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
        id, name, quantity, price,
        machinery, labour, description,
        date_added
    ) VALUES (
        OLD.id, OLD.name, OLD.quantity, OLD.price,
        OLD.machinery, OLD.labour, OLD.description,
        OLD.date_added
    );
END;
DROP TRIGGER IF EXISTS insert_product_from_raw;

CREATE TRIGGER insert_product_from_raw
AFTER INSERT ON raw_material
FOR EACH ROW
BEGIN
    -- UPSERT into products
    INSERT INTO products (name, cost_price, stock, date)
    VALUES (
        NEW.name,
        (NEW.price + NEW.machinery + NEW.labour) / NEW.quantity,
        NEW.quantity,
        NEW.date_added
    )
    ON CONFLICT(name)
    DO UPDATE SET
        stock = excluded.stock,
        cost_price = excluded.cost_price,
        date = excluded.date;

    -- Log into products_history
    INSERT INTO products_history (
        name, cost_price, stock, date, action
    ) VALUES (
        NEW.name,
        (NEW.price + NEW.machinery + NEW.labour) / NEW.quantity,
        NEW.quantity,
        NEW.date_added,
        'Cost Calculation'
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
DROP TRIGGER IF EXISTS update_product_from_raw;

CREATE TRIGGER update_product_from_raw
AFTER UPDATE ON raw_material
FOR EACH ROW
BEGIN
    -- UPSERT into products
    INSERT INTO products (name, cost_price, stock, date)
    VALUES (
        NEW.name,
        (NEW.price + NEW.machinery + NEW.labour) / NEW.quantity,
        NEW.quantity,
        NEW.date_added
    )
    ON CONFLICT(name)
    DO UPDATE SET
        stock = stock + excluded.stock,
        cost_price = excluded.cost_price,
        date = excluded.date;

    -- Log into products_history
    INSERT INTO products_history (
        name, cost_price, stock, date, action
    ) VALUES (
        NEW.name,
        (NEW.price + NEW.machinery + NEW.labour) / NEW.quantity,
        NEW.quantity,
        NEW.date_added,
        'Cost Calculation'
    );
END;
