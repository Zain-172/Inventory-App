import path from "path";
import os from "os";
import fs from "fs";
import Database from "better-sqlite3";

function getAppDataDir(appName) {
  const platform = process.platform;
  let baseDir;

  if (platform === "win32") {
    baseDir = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
  } else if (platform === "darwin") {
    baseDir = path.join(os.homedir(), "Library", "Application Support");
  } else {
    baseDir = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  }

  return path.join(baseDir, appName);
}

// ── Paths ──────────────────────────────────────────────────────
const appDir  = getAppDataDir("desktop-app");
const dbPath  = path.join(appDir, "Database.db");

// Seed DB bundled with your app (backend/database/Database.db)
const seedPath = path.join(process.resourcesPath ?? process.cwd(), "Database", "Database.db");
console.log("Resource Path:", process.resourcesPath ?? process.cwd());
console.log("App Data Directory:", appDir);
console.log("Database Path:", dbPath);
console.log("Seed Database Path:", seedPath);
// ── Ensure directory exists ────────────────────────────────────
fs.mkdirSync(appDir, { recursive: true });

// ── Copy seed DB if no DB exists yet ──────────────────────────
if (!fs.existsSync(dbPath)) {
  if (fs.existsSync(seedPath)) {
    fs.copyFileSync(seedPath, dbPath);
    console.log("✅ Fresh database created from seed:", dbPath);
  } else {
    console.warn("⚠️ No seed DB found. A blank database will be created.");
  }
}

// ── Open database ──────────────────────────────────────────────
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

console.log("✅ Database connected at:", dbPath);

export default db;