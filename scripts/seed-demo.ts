import Database from "better-sqlite3";
import path from "path";
import { execSync } from "child_process";
import { DEMO_RESTAURANTS } from "../src/lib/database/seedData";

// Resolve SQLite database file path used by KulinerDekat
const dbPath = path.resolve(__dirname, "../kuliner_dekat.db");
console.log(`[KulinerDekat DB Seed] Connecting to SQLite database at: ${dbPath}`);

const db = new Database(dbPath);

// Enable SQLite Foreign Key constraints
db.pragma("foreign_keys = ON");

// Ensure DDL tables and alias views exist
db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_place_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    category TEXT NOT NULL,
    rating REAL NOT NULL,
    image TEXT,
    image_url TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER NOT NULL,
    restaurant_id INTEGER,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    image_url TEXT,
    FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER NOT NULL,
    restaurant_id INTEGER,
    user_name TEXT NOT NULL,
    reviewer_name TEXT,
    rating REAL NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
  );

  CREATE VIEW IF NOT EXISTS restaurants AS 
    SELECT id, external_place_id, name, description, address, latitude, longitude, category, rating, COALESCE(image, image_url) as image, COALESCE(image_url, image) as image_url, created_at 
    FROM places;

  CREATE VIEW IF NOT EXISTS menu_items AS 
    SELECT id, place_id as restaurant_id, place_id, name, description, price, COALESCE(image, image_url) as image, COALESCE(image_url, image) as image_url 
    FROM menus;
`);

const insertPlaceStmt = db.prepare(`
  INSERT OR REPLACE INTO places (
    id, external_place_id, name, description, address, latitude, longitude, category, rating, image, image_url, created_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  );
`);

const insertMenuStmt = db.prepare(`
  INSERT OR REPLACE INTO menus (
    id, place_id, restaurant_id, name, description, price, image, image_url
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?
  );
`);

const insertReviewStmt = db.prepare(`
  INSERT OR REPLACE INTO reviews (
    id, place_id, restaurant_id, user_name, reviewer_name, rating, comment, created_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?
  );
`);

const seedTransaction = db.transaction((restaurants) => {
  for (const resto of restaurants) {
    insertPlaceStmt.run(
      resto.id,
      resto.external_place_id,
      resto.name,
      resto.description,
      resto.address,
      resto.latitude,
      resto.longitude,
      resto.category,
      resto.rating,
      resto.image,
      resto.image,
      resto.created_at
    );

    for (const menu of resto.menus) {
      insertMenuStmt.run(
        menu.id,
        resto.id,
        resto.id,
        menu.name,
        menu.description,
        menu.price,
        menu.image,
        menu.image
      );
    }

    for (const rev of resto.reviews) {
      insertReviewStmt.run(
        rev.id,
        resto.id,
        resto.id,
        rev.user_name,
        rev.reviewer_name,
        rev.rating,
        rev.comment,
        rev.created_at
      );
    }
  }
});

console.log("[KulinerDekat DB Seed] Seeding demo restaurant dataset...");
seedTransaction(DEMO_RESTAURANTS);
console.log("[KulinerDekat DB Seed] Database seeded successfully!");

// Check ADB connection if Android emulator/device is connected
try {
  const adbDevices = execSync("adb devices", { encoding: "utf8" });
  if (adbDevices.includes("\tdevice")) {
    console.log("[KulinerDekat DB Seed] Active Android device/emulator detected via ADB.");
    const pkgName = "com.kulinerdekat.app";
    const remoteDbPath = `/data/data/${pkgName}/databases/kuliner_dekat.db`;

    try {
      execSync(`adb push "${dbPath}" "${remoteDbPath}"`, { stdio: "ignore" });
      console.log(`[KulinerDekat DB Seed] Synced database to Android device (${remoteDbPath}).`);
    } catch {
      try {
        execSync(`adb push "${dbPath}" /sdcard/kuliner_dekat.db`, { stdio: "ignore" });
        execSync(`adb shell "run-as ${pkgName} cp /sdcard/kuliner_dekat.db /data/data/${pkgName}/databases/kuliner_dekat.db"`, { stdio: "ignore" });
        console.log(`[KulinerDekat DB Seed] Synced database via run-as sandbox to Android device.`);
      } catch {
        console.log("[KulinerDekat DB Seed] Note: Database updated locally. App will load current seed dataset on next launch.");
      }
    }
  }
} catch {
  // ADB not in PATH or no device connected
}
