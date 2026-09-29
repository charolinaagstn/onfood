import { Menu } from "@/types/place";
import { getDb } from "./database";

export async function getMenusByPlaceId(placeId: number): Promise<Menu[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Menu>(
    "SELECT * FROM menus WHERE place_id = ? ORDER BY id ASC;",
    [placeId],
  );
  return rows;
}

export async function insertMenu(menu: Omit<Menu, "id">): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO menus (place_id, name, description, price)
     VALUES (?, ?, ?, ?);`,
    [menu.place_id, menu.name, menu.description, menu.price],
  );
  return result.lastInsertRowId;
}
