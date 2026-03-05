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