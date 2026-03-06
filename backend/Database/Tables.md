# DATABASE
---------------------------------------
```
CREATE TABLE "sale_items" (
	"item_id"	INTEGER,
	"sale_id"	INTEGER NOT NULL,
	"product_id"	INTEGER NOT NULL,
	"product_name"	TEXT NOT NULL,
	"quantity"	INTEGER NOT NULL,
	"price"	REAL NOT NULL,
	PRIMARY KEY("item_id" AUTOINCREMENT),
	FOREIGN KEY("product_id") REFERENCES "products"("id"),
	FOREIGN KEY("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE
);
```
-------------------------------------------------------
```
CREATE TABLE products (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 cost_price REAL NOT NULL,
 stock REAL NOT NULL,
 date TEXT NOT NULL,
 type TEXT DEFAULT 'production',
 UNIQUE(name, type)
);
```
-----------------------------------------------------
```
CREATE TABLE employee_accounts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	employee_id INTEGER NOT NULL,
	payment REAL NOT NULL,
	reason TEXT "salary payment",
	time_stamp datetime DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
)
```