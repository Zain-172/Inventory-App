import db from "../Database/DB.js";

export default class RawMaterial {
    constructor({id, name, quantity, price, machinery, labour, description, date_added} = {}) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.machinery = machinery;
        this.labour = labour;
        this.description = description;
        this.date_added = date_added;
    }
    getRawMaterials = (req, res) => {
        try {
            const rows = db.prepare("SELECT id, name, quantity, price, machinery, labour, description, date_added FROM raw_material").all();
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    insertRawMaterial = (req, res) => {
        const material = new RawMaterial(req.body);
        try {
            const stmt = db.prepare(`
                INSERT INTO raw_material (name, quantity, price, machinery, labour, description, date_added)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(name) DO UPDATE
                SET quantity = excluded.quantity, price = excluded.price, machinery = excluded.machinery, labour = excluded.labour, description = excluded.description, date_added = excluded.date_added`
            );
            const info = stmt.run(material.name, material.quantity, material.price, material.machinery, material.labour, material.description, material.date_added);
            res.status(201).json({ message: "Raw Material added", materialId: info.lastInsertRowid });
        } catch (err) {
            console.error(err);
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
        console.log("Updating Raw Material ID:", id, "with data:", material);
        try {
            const stmt = db.prepare("UPDATE raw_material SET name = ?, quantity = ?, price = ?, machinery = ?, labour = ?, description = ?, date_added = ? WHERE id = ?");
            const info = stmt.run(material.name, material.quantity, material.price, material.machinery, material.labour, material.description, material.date_added, id);
            if (info.changes === 0) {
                res.status(404).json({ message: "Raw Material not found" });
            } else {
                res.json({ message: "Raw Material updated" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}