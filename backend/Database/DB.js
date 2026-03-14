import path from "path";
import os from "os";
import Database from "better-sqlite3";

// User home directory
const homeDir = os.homedir();

// Absolute path to Roaming (Windows)
const dbPath = path.join(homeDir, "AppData", "Roaming", "Inventory-Manager", "Database.db");

// Use with better-sqlite3
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

export default db;