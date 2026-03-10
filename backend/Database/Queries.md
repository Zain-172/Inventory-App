# Queries
-------------------------------------------------------------------
```
SELECT sum(amount) as Expense from expense WHERE date = CURRENT_DATE
```
----------------------------------------------------------------------
```
SELECT sum(total_amount)-sum(total_cost) FROM sales WHERE sale_date = CURRENT_DATE
```
-------------------------------------------------------------------------
```
SELECT sum(total_amount) FROM sales WHERE sale_date = CURRENT_DATE
```
-----------------------------------------------------------------------
```
SELECT count(id) FROM sales WHERE sale_date = CURRENT_DATE
```
------------------------------------------------------------------------
```
SELECT count(id) FROM customers WHERE type like 'normal'
```
----------------------------------------------------------------------