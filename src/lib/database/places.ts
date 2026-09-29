import { Place } from "@/types/place";
import { getDb } from "./database";

export async function getPlaces(): Promise<Place[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Place>("SELECT * FROM places ORDER BY id ASC;");
  return rows;
}

export async function getPlaceById(id: number): Promise<Place | null> {
  const db = await getDb();
  const place = await db.getFirstAsync<Place>(
    "SELECT * FROM places WHERE id = ?;",
    [id],
  );
  return place ?? null;
}

export async function searchPlaces(
  query: string = "",
  category: string = "all",
): Promise<Place[]> {
  const db = await getDb();
  let sql = "SELECT * FROM places WHERE 1=1";
  const params: (string | number)[] = [];

  if (query.trim().length > 0) {
    const searchTerm = `%${query.trim().toLowerCase()}%`;
    sql += " AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ? OR LOWER(category) LIKE ?)";
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (category && category !== "all" && category !== "nearby" && category !== "rating") {
    sql += " AND LOWER(category) LIKE ?";
    params.push(`%${category.toLowerCase()}%`);
  }

  sql += " ORDER BY id ASC;";

  const rows = await db.getAllAsync<Place>(sql, params);
  return rows;
}

export async function insertPlace(place: Omit<Place, "id" | "created_at">): Promise<number> {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO places (external_place_id, name, address, latitude, longitude, category, rating, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      place.external_place_id ?? null,
      place.name,
      place.address,
      place.latitude,
      place.longitude,
      place.category,
      place.rating,
      createdAt,
    ],
  );
  return result.lastInsertRowId;
}
