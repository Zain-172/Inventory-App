BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "attendence" (
	"id"	INTEGER,
	"employee_id"	INTEGER NOT NULL,
	"date"	TEXT NOT NULL,
	"status"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	UNIQUE("employee_id","date"),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "customers" (
	"id"	INTEGER,
	"customer"	TEXT NOT NULL,
	"phone"	TEXT,
	"address"	TEXT,
	"type"	TEXT DEFAULT 'normal',
	"date_added"	TEXT DEFAULT (datetime('now')),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "employee_accounts" (
	"id"	INTEGER,
	"employee_id"	INTEGER NOT NULL,
	"amount"	REAL NOT NULL,
	"reason"	TEXT DEFAULT 'salary payment',
	"date"	DATETIME DEFAULT CURRENT_DATE,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "employees" (
	"employee_id"	INTEGER,
	"name"	TEXT NOT NULL,
	"position"	TEXT NOT NULL,
	"salary"	REAL NOT NULL DEFAULT 0,
	"phone"	TEXT,
	"address"	TEXT,
	"date_updated"	TEXT DEFAULT (datetime('now')),
	PRIMARY KEY("employee_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "expense" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"description"	TEXT,
	"amount"	REAL NOT NULL,
	"date"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "khata_accounts" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"phone"	TEXT,
	"address"	TEXT,
	"opening_balance"	REAL NOT NULL DEFAULT 0,
	"current_balance"	REAL NOT NULL DEFAULT 0,
	"note"	TEXT,
	"date_added"	TEXT NOT NULL DEFAULT (date('now')),
	"updated_at"	TEXT DEFAULT (datetime('now')),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "materials" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"description"	TEXT,
	"amount"	REAL NOT NULL,
	"date"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "products" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"cost_price"	REAL NOT NULL,
	"stock"	REAL NOT NULL,
	"date"	TEXT NOT NULL,
	"type"	TEXT DEFAULT 'production',
	"barcode"	TEXT NOT NULL DEFAULT 10000 UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT),
	UNIQUE("name","type")
);
CREATE TABLE IF NOT EXISTS "products_history" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"stock"	INTEGER NOT NULL,
	"cost_price"	REAL NOT NULL,
	"date"	TEXT,
	"action"	TEXT,
	"type"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "raw_material" (
	"id"	INTEGER,
	"raw_id"	INTEGER,
	"product_id"	INTEGER,
	"quantity"	INTEGER NOT NULL DEFAULT 0,
	"date"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	UNIQUE("raw_id","product_id"),
	FOREIGN KEY("product_id") REFERENCES "products"("id"),
	FOREIGN KEY("raw_id") REFERENCES "products"("id")
);
CREATE TABLE IF NOT EXISTS "sale_items" (
	"item_id"	INTEGER,
	"sale_id"	INTEGER NOT NULL,
	"barcode"	TEXT NOT NULL,
	"product_name"	TEXT NOT NULL,
	"quantity"	INTEGER NOT NULL,
	"price"	REAL NOT NULL,
	PRIMARY KEY("item_id" AUTOINCREMENT),
	FOREIGN KEY("barcode") REFERENCES "products"("barcode"),
	FOREIGN KEY("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "sales" (
	"id"	INTEGER,
	"invoice_id"	TEXT NOT NULL UNIQUE,
	"sale_date"	TEXT NOT NULL,
	"salesman"	TEXT NOT NULL,
	"total_amount"	REAL NOT NULL DEFAULT 0,
	"total_items"	INTEGER NOT NULL DEFAULT 0,
	"total_cost"	REAL NOT NULL DEFAULT 0,
	"customer_id"	INTEGER,
	"status"	TEXT NOT NULL DEFAULT 'paid',
	"customer"	TEXT,
	"tax"	REAL NOT NULL DEFAULT 0,
	"delivery_status"	TEXT NOT NULL DEFAULT 'not_delivered',
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("customer_id") REFERENCES "customers"("id")
);
CREATE TABLE IF NOT EXISTS "user" (
	"user_id"	INTEGER UNIQUE,
	"username"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"date_created"	date DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);
CREATE TRIGGER deduct_raw_material_on_product_insert
AFTER UPDATE OF stock ON products
FOR EACH ROW
WHEN NEW.stock > OLD.stock AND EXISTS (
    SELECT 1 FROM raw_material WHERE product_id = NEW.id
)
BEGIN
    UPDATE products
    SET stock = stock - (
        SELECT rm.quantity * (NEW.stock - OLD.stock)
        FROM raw_material rm
        WHERE rm.raw_id = products.id
        AND rm.product_id = NEW.id
    )
    WHERE id IN (
        SELECT raw_id
        FROM raw_material
        WHERE product_id = NEW.id
    );
END;
CREATE TRIGGER deduct_raw_material_update
AFTER INSERT ON raw_material
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.raw_id;
END;
CREATE TRIGGER generate_barcode
AFTER INSERT ON products
BEGIN
UPDATE products
SET barcode = 'BR' || printf('%05d', NEW.id)
WHERE id = NEW.id;
END;
CREATE TRIGGER prevent_negative_raw_stock
BEFORE UPDATE OF stock ON products
FOR EACH ROW
WHEN EXISTS (
    SELECT 1
    FROM raw_material rm
    JOIN products p ON p.id = rm.raw_id
    WHERE rm.product_id = NEW.id
      AND p.stock < rm.quantity * (NEW.stock - OLD.stock)
)
BEGIN
    SELECT RAISE(ABORT, 'Insufficient raw material stock');
END;
CREATE TRIGGER reduce_inventory_after_sale
AFTER INSERT ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE barcode = NEW.barcode;
END;
CREATE TRIGGER restore_raw_materials_before_delete
BEFORE DELETE ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock + (
        SELECT rm.quantity * OLD.quantity
        FROM raw_material rm
        INNER JOIN products p ON rm.product_id = p.id
        WHERE p.barcode = OLD.barcode
          AND rm.raw_id = products.id
    )
    WHERE id IN (
        SELECT rm.raw_id
        FROM raw_material rm
        INNER JOIN products p ON rm.product_id = p.id
        WHERE p.barcode = OLD.barcode
    );
END;
CREATE TRIGGER restore_stock_after_delete
AFTER DELETE ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock + OLD.quantity
    WHERE barcode = OLD.barcode;
END;
COMMIT;
