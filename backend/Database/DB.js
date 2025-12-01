import Database from "better-sqlite3";
const db = new Database("./Database/Database.db");
db.pragma('foreign_keys = ON'); // enable foreign key constraints
db.pragma('journal_mode = WAL'); // enable concurrent read/write

export default db;