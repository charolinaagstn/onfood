import * as SQLite from "expo-sqlite";

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

  // Create relational tables as specified in BNSP requirements
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_place_id TEXT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      category TEXT NOT NULL,
      rating REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      rating REAL NOT NULL,
      comment TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
    );
  `);

  // Idempotent seed initialization
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM places;",
  );

  if (!result || result.count === 0) {
    await seedDatabase(db);
  }
}

async function seedDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  const seedPlaces = [
    {
      name: "Pempek Selamat R. Sukamto",
      address: "Jl. R. Sukamto No. 47, 8 Ilir, Palembang",
      latitude: -2.9645,
      longitude: 104.7612,
      category: "Pempek & Kuliner khas",
      rating: 4.8,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Pempek Kapal Selam",
          description: "Pempek isi telur bebek utuh dengan kuah cuko pedas mantap",
          price: 25000,
        },
        {
          name: "Pempek Lenjer Besar",
          description: "Pempek lenjer khas Palembang berbahan ikan tenggiri segar",
          price: 22000,
        },
        {
          name: "Tekwan Spesial",
          description: "Sup olahan ikan khas Palembang dengan kuah udang gurih",
          price: 20000,
        },
      ],
      reviews: [
        {
          user_name: "Andi Wijaya",
          rating: 5,
          comment: "Pempeknya sangat lembut dan cukonya mantap sekali! Wajib dicoba.",
          created_at: "2026-09-15 12:30:00",
        },
        {
          user_name: "Budi Santoso",
          rating: 4.5,
          comment: "Lokasi strategis, ikan terasa sangat gurih dan segar.",
          created_at: "2026-09-18 14:15:00",
        },
      ],
    },
    {
      name: "Pempek Noni Sudirman",
      address: "Jl. Jend. Sudirman No. 108, 20 Ilir, Palembang",
      latitude: -2.9812,
      longitude: 104.7570,
      category: "Pempek & Oleh-oleh",
      rating: 4.7,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Pempek Adaan (5 pcs)",
          description: "Pempek bulat isi bawang gurih khas Palembang",
          price: 25000,
        },
        {
          name: "Model Ikan Tahu",
          description: "Model tahu digoreng disiram kuah bening kaldu udang",
          price: 18000,
        },
        {
          name: "Es Kacang Merah",
          description: "Es pencuci mulut khas Palembang dengan kacang merah manis",
          price: 15000,
        },
      ],
      reviews: [
        {
          user_name: "Siti Rahmawati",
          rating: 5,
          comment: "Es kacang merahnya manisnya pas dan pempek adaan super gurih!",
          created_at: "2026-09-20 16:45:00",
        },
      ],
    },
    {
      name: "Martabak HAR 10 Ulu",
      address: "Jl. KH. Azhari No. 10, 10 Ulu, Palembang",
      latitude: -2.9920,
      longitude: 104.7680,
      category: "Martabak & Kuliner India",
      rating: 4.9,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Martabak Telur Bebek Kuah Kari",
          description: "Martabak khas HAR disiram kuah kari kentang kentang & rempah",
          price: 35000,
        },
        {
          name: "Martabak Telur Ayam",
          description: "Martabak renyah disajikan dengan kuah kari khas",
          price: 28000,
        },
        {
          name: "Nasi Briyani Palembang",
          description: "Nasi briyani kaya rempah disajikan dengan lauk daging",
          price: 45000,
        },
      ],
      reviews: [
        {
          user_name: "Rian Hidayat",
          rating: 5,
          comment: "Kuah karinya sangat khas dan martabaknya renyah luar biasa.",
          created_at: "2026-09-22 19:10:00",
        },
      ],
    },
    {
      name: "Bakso Cak Man Angkatan 45",
      address: "Jl. Angkatan 45 No. 12, Lorok Pakjo, Palembang",
      latitude: -2.9730,
      longitude: 104.7420,
      category: "Bakso & Mie",
      rating: 4.6,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Bakso Komplit Super",
          description: "Bakso urat, bakso halus, tahu bakso, dan pangsit goreng",
          price: 28000,
        },
        {
          name: "Mie Ayam Bakso",
          description: "Mie ayam bumbu manis gurih lengkap dengan 2 bakso",
          price: 20000,
        },
        {
          name: "Bakso Urat Jumbo",
          description: "Bakso urat berukuran besar dengan isian daging cincang",
          price: 25000,
        },
      ],
      reviews: [
        {
          user_name: "Maya Kartika",
          rating: 4,
          comment: "Kuah baksonya ngaldu banget, bakso uratnya mantap.",
          created_at: "2026-09-23 13:00:00",
        },
      ],
    },
    {
      name: "Mie Celor 26 Ilir H. Syafei",
      address: "Jl. Merdeka No. 26 Ilir, Palembang",
      latitude: -2.9880,
      longitude: 104.7540,
      category: "Kuliner Tradisional",
      rating: 4.8,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Mie Celor Spesial Udang",
          description: "Mie besar disiram kuah kental santan udang manis gurih",
          price: 26000,
        },
        {
          name: "Mie Celor Telur Utuh",
          description: "Mie celor dengan topping telur rebus matang",
          price: 22000,
        },
        {
          name: "Teh Tawar Hangat",
          description: "Teh manis / tawar pendamping mie celor",
          price: 5000,
        },
      ],
      reviews: [
        {
          user_name: "Doni Pratama",
          rating: 5,
          comment: "Kuah udang kentalnya juara! Selalu ramai pengunjung.",
          created_at: "2026-09-24 09:30:00",
        },
      ],
    },
    {
      name: "Riverside Restaurant Kuto Besak",
      address: "Komplek Benteng Kuto Besak, Jl. Rumah Bari, Palembang",
      latitude: -2.9915,
      longitude: 104.7605,
      category: "Seafood & Restaurant",
      rating: 4.7,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Pindang Patin Sungai",
          description: "Pindang ikan patin segar rasa asam pedas manis khas Palembang",
          price: 55000,
        },
        {
          name: "Udang Satang Bakar",
          description: "Udang galah segar dibakar bumbu asam manis",
          price: 85000,
        },
        {
          name: "Es Kelapa Muda Utuh",
          description: "Es kelapa segar diminum di tepi Sungai Musi",
          price: 20000,
        },
      ],
      reviews: [
        {
          user_name: "Clarissa Dewi",
          rating: 5,
          comment: "Makan malam sambil menikmati pemandangan Jembatan Ampera sangat indah.",
          created_at: "2026-09-25 20:00:00",
        },
      ],
    },
    {
      name: "Boekit Coffee & Eatery",
      address: "Jl. Bukit Besar No. 88, Palembang",
      latitude: -2.9830,
      longitude: 104.7330,
      category: "Cafe & Kopi",
      rating: 4.5,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Kopi Susu Gula Aren",
          description: "Espresso espresso blend dengan susu segar & gula aren asli",
          price: 22000,
        },
        {
          name: "Roti Bakar Cokelat Keju",
          description: "Roti bakar tebal melimpah toping keju & cokelat",
          price: 18000,
        },
        {
          name: "Kentang Goreng Keju",
          description: "French fries renyah bertabur bumbu keju",
          price: 16000,
        },
      ],
      reviews: [
        {
          user_name: "Eko Prasetyo",
          rating: 4,
          comment: "Tempat nongkrong asik, wifi cepat dan kopi enak.",
          created_at: "2026-09-26 15:45:00",
        },
      ],
    },
    {
      name: "Pindang Meranjat Ibu Uning",
      address: "Jl. Demang Lebar Daun No. 34, Palembang",
      latitude: -2.9690,
      longitude: 104.7290,
      category: "Pindang & Khas Palembang",
      rating: 4.8,
      created_at: new Date().toISOString(),
      menus: [
        {
          name: "Pindang Baung Meranjat",
          description: "Ikan baung segar disajikan dengan kuah pindang khas Meranjat",
          price: 60000,
        },
        {
          name: "Pindang Tulang Sapi",
          description: "Pindang iga tulang sapi empuk rasa rempah asam segar",
          price: 65000,
        },
        {
          name: "Sambal Nanas Terasi",
          description: "Pelengkap makan pindang dengan potongan nanas manis asam pedas",
          price: 10000,
        },
      ],
      reviews: [
        {
          user_name: "Farhan Permana",
          rating: 5,
          comment: "Rasa pedas manis asam pindangnya sangat segar dan authentic!",
          created_at: "2026-09-27 12:15:00",
        },
      ],
    },
  ];

  for (const place of seedPlaces) {
    const res = await db.runAsync(
      `INSERT INTO places (external_place_id, name, address, latitude, longitude, category, rating, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        null,
        place.name,
        place.address,
        place.latitude,
        place.longitude,
        place.category,
        place.rating,
        place.created_at,
      ],
    );

    const placeId = res.lastInsertRowId;

    for (const menu of place.menus) {
      await db.runAsync(
        `INSERT INTO menus (place_id, name, description, price)
         VALUES (?, ?, ?, ?);`,
        [placeId, menu.name, menu.description, menu.price],
      );
    }

    for (const review of place.reviews) {
      await db.runAsync(
        `INSERT INTO reviews (place_id, user_name, rating, comment, created_at)
         VALUES (?, ?, ?, ?, ?);`,
        [placeId, review.user_name, review.rating, review.comment, review.created_at],
      );
    }
  }
}
