# Triggers
```
DROP TRIGGER "main"."before_update_raw_material";
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
END
```
-------------------------------------------------------------------
```
DROP TRIGGER "main"."insert_product_from_raw";
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
END
```
-----------------------------------------------------------------------
```
DROP TRIGGER "main"."reduce_inventory_after_sale";
CREATE TRIGGER reduce_inventory_after_sale
AFTER INSERT ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
END
```
----------------------------------------------------------------------
```
DROP TRIGGER "main"."restore_stock_after_delete";
CREATE TRIGGER restore_stock_after_delete
AFTER DELETE ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock = stock + OLD.quantity
    WHERE id = OLD.product_id;
END
```
----------------------------------------------------------------------
```
DROP TRIGGER "main"."update_product_from_raw";
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
END
```
-------------------------------------------------------------------------
```
DROP TRIGGER "main"."generate_barcode";
CREATE TRIGGER generate_barcode
AFTER INSERT ON products
BEGIN
UPDATE products
SET barcode = 'BR' || printf('%05d0', NEW.id)
WHERE id = NEW.id;
END
```