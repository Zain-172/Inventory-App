import db from "../Database/DB.js";
import crypto from "crypto";

let mpinColumnChecked = false;
let ntnColumnChecked = false;

function ensureMpinColumn() {
    if (mpinColumnChecked) {
        return;
    }

    const columns = db.prepare("PRAGMA table_info('user')").all();
    const hasMpin = columns.some((column) => column.name === "mpin");

    if (!hasMpin) {
        db.prepare("ALTER TABLE user ADD COLUMN mpin TEXT").run();
    }

    mpinColumnChecked = true;
}

function ensureNtnColumn() {
    if (ntnColumnChecked) {
        return;
    }

    const columns = db.prepare("PRAGMA table_info('user')").all();
    const hasNtn = columns.some((column) => column.name === "ntn");

    if (!hasNtn) {
        db.prepare("ALTER TABLE user ADD COLUMN ntn TEXT").run();
    }

    ntnColumnChecked = true;
}

function ensureUserSecurityColumns() {
    ensureMpinColumn();
    ensureNtnColumn();
}

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
        ensureUserSecurityColumns();
        const { username, password } = req.body;
        try {
            const stmt = db.prepare("SELECT user_id, username, email, ntn, password FROM user WHERE username = ?");
            const user = stmt.get(username);
            if (user && this.verifyPassword(password, user.password)) {
                // Set session or token here
                res.json({ id: user.user_id, username: user.username, email: user.email, ntn: user.ntn, login: true });
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

    hashMPIN = (mpin) => {
        const hash = crypto.createHash("sha256");
        hash.update(mpin);
        return hash.digest("hex");
    }

        // ================================

    resetPassword = (req, res) => {
        ensureUserSecurityColumns();
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

    getMPINStatus = (req, res) => {
        ensureUserSecurityColumns();
        const userId = Number(req.params.userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        try {
            const stmt = db.prepare("SELECT mpin FROM user WHERE user_id = ?");
            const user = stmt.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.json({ success: true, isSet: Boolean(user.mpin) });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    setMPIN = (req, res) => {
        ensureUserSecurityColumns();
        const { userId, mpin } = req.body;

        if (!userId || !/^\d{4}$/.test(String(mpin))) {
            return res.status(400).json({ success: false, message: "MPIN must be exactly 4 digits" });
        }

        try {
            const getStmt = db.prepare("SELECT mpin FROM user WHERE user_id = ?");
            const user = getStmt.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (user.mpin) {
                return res.status(400).json({ success: false, message: "MPIN is already set" });
            }

            const updateStmt = db.prepare("UPDATE user SET mpin = ? WHERE user_id = ?");
            updateStmt.run(this.hashMPIN(String(mpin)), userId);

            return res.json({ success: true, message: "MPIN set successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    verifyMPIN = (req, res) => {
        ensureUserSecurityColumns();
        const { userId, mpin } = req.body;

        if (!userId || !/^\d{4}$/.test(String(mpin))) {
            return res.status(400).json({ success: false, message: "MPIN must be exactly 4 digits" });
        }

        try {
            const stmt = db.prepare("SELECT mpin FROM user WHERE user_id = ?");
            const user = stmt.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (!user.mpin) {
                return res.status(400).json({ success: false, message: "MPIN is not set" });
            }

            const isValid = this.hashMPIN(String(mpin)) === user.mpin;
            if (!isValid) {
                return res.status(401).json({ success: false, message: "Invalid MPIN" });
            }

            return res.json({ success: true, message: "MPIN verified" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    getNTNStatus = (req, res) => {
        ensureUserSecurityColumns();
        const userId = Number(req.params.userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        try {
            const stmt = db.prepare("SELECT ntn FROM user WHERE user_id = ?");
            const user = stmt.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.json({ success: true, isSet: Boolean(user.ntn) });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    setNTN = (req, res) => {
        ensureUserSecurityColumns();
        const { userId, ntn } = req.body;
        const normalizedNtn = String(ntn || "").trim();

        if (!userId || !/^\d{7,15}$/.test(normalizedNtn)) {
            return res.status(400).json({ success: false, message: "NTN must be 7 to 15 digits" });
        }

        try {
            const getStmt = db.prepare("SELECT ntn FROM user WHERE user_id = ?");
            const user = getStmt.get(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (user.ntn) {
                return res.status(400).json({ success: false, message: "NTN is already set" });
            }

            const updateStmt = db.prepare("UPDATE user SET ntn = ? WHERE user_id = ?");
            updateStmt.run(normalizedNtn, userId);

            return res.json({ success: true, message: "NTN set successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}