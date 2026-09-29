import { Review } from "@/types/place";
import { getDb } from "./database";

export async function getReviewsByPlaceId(placeId: number): Promise<Review[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Review>(
    "SELECT * FROM reviews WHERE place_id = ? ORDER BY id DESC;",
    [placeId],
  );
  return rows;
}

export async function insertReview(review: Omit<Review, "id" | "created_at">): Promise<number> {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO reviews (place_id, user_name, rating, comment, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    [review.place_id, review.user_name, review.rating, review.comment, createdAt],
  );
  return result.lastInsertRowId;
}
