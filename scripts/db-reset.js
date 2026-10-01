const Database = require("better-sqlite3");
const path = require("path");
const { execSync } = require("child_process");

const dbPath = path.resolve(__dirname, "../kuliner_dekat.db");
console.log(`[KulinerDekat DB Reset] Resetting SQLite database at: ${dbPath}`);

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

db.exec(`
  DELETE FROM reviews;
  DELETE FROM menus;
  DELETE FROM places;
`);

console.log("[KulinerDekat DB Reset] Existing database rows cleared.");

db.close();

// Now trigger seed
require("./db-seed.js");
