import db from "../Database/DB.js";
import crypto from "crypto";
export default class SignUp {
    constructor(id, username, email, password, date_added) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.date_added = date_added;
    }
    // ================================
    // SIGN UP
    // ================================
    signUp = (req, res) => {
        const { username, email, password } = req.body;
        try {
            const stmt = db.prepare("INSERT INTO user (username, email, password) VALUES (?, ?, ?)");
            const hashed_password = this.hashPassword(password);
            const info = stmt.run(username, email, hashed_password);
            res.json({ id: info.lastInsertRowid, username, email });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    // ================================
    // SEARCH USERS
    // ================================
    searchUsers = (req, res) => {
        const { query } = req.query;
        try {
            const stmt = db.prepare(
                `SELECT id, username, email, date_added 
                 FROM users 
                 WHERE username LIKE ? OR email LIKE ?`
            );
            const results = stmt.all(`%${query}%`, `%${query}%`);
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    hashPassword = (password) => {
        const hash = crypto.createHash("sha256");
        hash.update(password);
        return hash.digest("hex"); // Replace with hashed password
    }
}