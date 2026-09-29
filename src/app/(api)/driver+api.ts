import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "DATABASE_URL belum dikonfigurasi" },
        { status: 500 },
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    const response = await sql`SELECT * FROM drivers ORDER BY id ASC`;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan GET drivers",
      },
      { status: 500 },
    );
  }
}
