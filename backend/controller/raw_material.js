import db from "../Database/DB.js";

export default class RawMaterial {
    constructor({ id, raw_id, product_id, quantity, date } = {}) {
        this.id = id;
        this.raw_id = raw_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.date = date;
    }

    getRawMaterials = (req, res) => {
        try {
            const rows = db
                .prepare(`
                    SELECT
                        rm.id,
                        rm.raw_id,
                        r.name AS raw_material,
                        rm.product_id,
                        p.name AS product,
                        rm.quantity,
                        rm.date
                    FROM raw_material rm
                    LEFT JOIN products r ON r.id = rm.raw_id
                    LEFT JOIN products p ON p.id = rm.product_id
                    ORDER BY rm.id DESC
                `)
                .all();
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    insertRawMaterial = (req, res) => {
        const { form_data, raw_materials } = req.body;

        if (!form_data || !form_data.name || !form_data.date) {
            return res.status(400).json({ message: "form_data with name and date is required" });
        }

        if (!Array.isArray(raw_materials) || raw_materials.length === 0) {
            return res.status(400).json({ message: "raw_materials must be a non-empty array" });
        }

        const name = String(form_data.name).trim();
        const cost_price = Number(form_data.cost_price ?? form_data.price ?? 0);
        const stock = Number(form_data.stock ?? form_data.quantity ?? 0);
        const date = form_data.date;
        const type = form_data.type || "production";

        if (!name || Number.isNaN(cost_price) || Number.isNaN(stock)) {
            return res.status(400).json({ message: "Invalid form_data values" });
        }

        try {
            const saveBatch = db.transaction(() => {
                const upsertProduct = db.prepare(`
                    INSERT INTO products (name, cost_price, stock, date, type)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(name, type) DO UPDATE
                    SET stock = stock + excluded.stock,
                        cost_price = excluded.cost_price,
                        date = excluded.date
                `);

                upsertProduct.run(name, cost_price, stock, date, type);

                const product = db
                    .prepare("SELECT id FROM products WHERE name = ? AND type = ? LIMIT 1")
                    .get(name, type);

                if (!product) {
                    throw new Error("Failed to resolve product id");
                }

                const insertRawMaterial = db.prepare(`
                    INSERT INTO raw_material (raw_id, product_id, quantity, date)
                    VALUES (?, ?, ?, ?)
                    on conflict(raw_id, product_id) do update
                    set quantity = quantity + excluded.quantity,
                        date = excluded.date
                `);

                for (const entry of raw_materials) {
                    const rawId = Number(entry.raw_id);
                    const qty = Number(entry.quantity);

                    if (Number.isNaN(rawId) || Number.isNaN(qty)) {
                        throw new Error("Invalid raw material entry values");
                    }

                    insertRawMaterial.run(rawId, product.id, qty/stock, date);
                }

                const insertHistory = db.prepare(`
                    INSERT INTO products_history (name, cost_price, stock, date, type, action)
                    VALUES (?, ?, ?, ?, ?, ?)
                `);
                insertHistory.run(name, cost_price, stock, date, type, form_data.action || "Cost Calculation");

                return product.id;
            });

            const productId = saveBatch();
            res.status(201).json({
                message: "Product and raw material entries saved",
                product_id: productId,
                raw_material_count: raw_materials.length,
            });
        } catch (err) {
            console.error(err);
            if (String(err.message).includes("FOREIGN KEY")) {
                return res.status(400).json({ message: "Invalid raw_id or product reference" });
            }
            if (String(err.message).includes("UNIQUE")) {
                return res.status(400).json({ message: "Product must be unique per type" });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    deleteRawMaterial = (req, res) => {
        const id = req.params.id;
        try {
            const stmt = db.prepare("DELETE FROM raw_material WHERE id = ?");
            const info = stmt.run(id);
            if (info.changes === 0) {
                res.status(404).json({ message: "Raw Material not found" });
            } else {
                res.json({ message: "Raw Material deleted" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    updateRawMaterial = (req, res) => {
        const id = req.params.id;
        const material = new RawMaterial(req.body);

        if (
            material.raw_id === undefined ||
            material.product_id === undefined ||
            material.quantity === undefined ||
            !material.date
        ) {
            return res.status(400).json({ message: "raw_id, product_id, quantity and date are required" });
        }

        try {
            const stmt = db.prepare(
                "UPDATE raw_material SET raw_id = ?, product_id = ?, quantity = ?, date = ? WHERE id = ?"
            );
            const info = stmt.run(material.raw_id, material.product_id, material.quantity, material.date, id);
            if (info.changes === 0) {
                res.status(404).json({ message: "Raw Material not found" });
            } else {
                res.json({ message: "Raw Material updated" });
            }
        } catch (err) {
            console.error(err);
            if (String(err.message).includes("FOREIGN KEY")) {
                return res.status(400).json({ message: "Invalid raw_id or product_id" });
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}