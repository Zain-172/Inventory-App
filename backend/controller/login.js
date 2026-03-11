import db from "../Database/DB.js";
import crypto from "crypto";

export default class Login {
    constructor(id, username, email, password, date_added) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.date_added = date_added;
    }
    // ================================
    // LOGIN
    // ================================
    login = (req, res) => {
        const { username, password } = req.body;
        try {
            const stmt = db.prepare("SELECT user_id, username, email, password FROM user WHERE username = ?");
            const user = stmt.get(username);
            if (user && this.verifyPassword(password, user.password)) {
                // Set session or token here
                res.json({ id: user.user_id, username: user.username, email: user.email, login: true });
            } else {
                res.status(401).json({ message: "Invalid credentials", login: false });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error", login: false });
        }
    };

    verifyPassword = (password, hashedPassword) => {
        const hash = crypto.createHash("sha256");
        hash.update(password);
        return hash.digest("hex") === hashedPassword;
    }

        // ================================

    resetPassword = (req, res) => {
        const { email, password } = req.body;
        console.log(email, password);
        try {
            const stmt = db.prepare("SELECT user_id FROM user WHERE email = ?");
            const user = stmt.get(email);
            if (user) {
                const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                const updateStmt = db.prepare("UPDATE user SET password = ? WHERE email = ?");
                updateStmt.run(hashedPassword, email);
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, message: "User not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}