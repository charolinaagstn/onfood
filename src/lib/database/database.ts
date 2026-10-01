import * as SQLite from "expo-sqlite";
import { DEMO_RESTAURANTS } from "./seedData";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("kuliner_dekat.db");
    await dbInstance.execAsync("PRAGMA foreign_keys = ON;");
  }
  return dbInstance;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  // Create tables supporting both places/restaurants and menus/menu_items contracts
  await db.execAsync(`
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

  // Check if seed data exists
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM places;",
  );

  if (!result || result.count === 0) {
    await seedDatabase(db);
  }
}

export async function seedDatabase(db?: SQLite.SQLiteDatabase): Promise<void> {
  const targetDb = db || (await getDb());

  for (const place of DEMO_RESTAURANTS) {
    await targetDb.runAsync(
      `INSERT OR REPLACE INTO places (id, external_place_id, name, description, address, latitude, longitude, category, rating, image, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        place.id,
        place.external_place_id,
        place.name,
        place.description,
        place.address,
        place.latitude,
        place.longitude,
        place.category,
        place.rating,
        place.image,
        place.image,
        place.created_at,
      ],
    );

    for (const menu of place.menus) {
      await targetDb.runAsync(
        `INSERT OR REPLACE INTO menus (id, place_id, restaurant_id, name, description, price, image, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          menu.id,
          place.id,
          place.id,
          menu.name,
          menu.description,
          menu.price,
          menu.image,
          menu.image,
        ],
      );
    }

    for (const review of place.reviews) {
      await targetDb.runAsync(
        `INSERT OR REPLACE INTO reviews (id, place_id, restaurant_id, user_name, reviewer_name, rating, comment, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          review.id,
          place.id,
          place.id,
          review.user_name,
          review.reviewer_name,
          review.rating,
          review.comment,
          review.created_at,
        ],
      );
    }
  }
}

export async function resetDatabase(db?: SQLite.SQLiteDatabase): Promise<void> {
  const targetDb = db || (await getDb());
  await targetDb.execAsync(`
    DELETE FROM reviews;
    DELETE FROM menus;
    DELETE FROM places;
  `);
  await seedDatabase(targetDb);
}
