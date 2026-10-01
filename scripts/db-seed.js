const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// Determine database path
const dbPath = path.resolve(__dirname, "../kuliner_dekat.db");
console.log(`[KulinerDekat DB Seed] Connecting to SQLite database at: ${dbPath}`);

const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Ensure tables exist
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

const DEMO_RESTAURANTS = [
  {
    id: 1,
    external_place_id: "demo-place-1",
    name: "Resto Pempek Selamat & Kuliner Palembang",
    description: "Warung kuliner khas Palembang menyajikan pempek kapal selam, tekwan, es cendol dawet, dan beragam makanan tradisional Nusantara.",
    address: "Jl. R. Sukamto No. 47, 8 Ilir, Palembang",
    latitude: -2.9645,
    longitude: 104.7612,
    category: "Pempek & Kuliner khas",
    rating: 4.8,
    image: "https://www.dapurkintamani.com/wp-content/uploads/2020/11/pempek-palembang.webp",
    created_at: "2026-09-15T12:00:00.000Z",
    menus: [
      {
        id: 101,
        name: "Pempek Palembang Kapal Selam",
        description: "Pempek isi telur bebek utuh dengan kuah cuko pedas manis mantap khas Palembang",
        price: 25000,
        image: "https://www.dapurkintamani.com/wp-content/uploads/2020/11/pempek-palembang.webp",
      },
      {
        id: 102,
        name: "Es Cendol Dawet Nangka",
        description: "Es pencuci mulut segar khas Indonesia dengan cendol hijau, nangka manis, gula aren & santan",
        price: 15000,
        image: "https://buckets.sasa.co.id/v1/AUTH_Assets/Assets/p/website/medias/page_medias/es_cendol_nangka.jpg",
      },
    ],
    reviews: [
      {
        id: 1001,
        user_name: "Andi Wijaya",
        reviewer_name: "Andi Wijaya",
        rating: 5,
        comment: "Pempeknya sangat lembut dan cukonya mantap sekali! Es cendolnya juga sangat menyegarkan.",
        created_at: "2026-09-15 12:30:00",
      },
      {
        id: 1002,
        user_name: "Budi Santoso",
        reviewer_name: "Budi Santoso",
        rating: 4.5,
        comment: "Lokasi strategis di Palembang, rasa ikan tenggiri berasa banget.",
        created_at: "2026-09-18 14:15:00",
      },
    ],
  },
  {
    id: 2,
    external_place_id: "demo-place-2",
    name: "Warung Nasi Goreng & Sate Madura Pak Kumis",
    description: "Spesialis Nasi Goreng Kampung dan Sate Ayam bumbu kacang khas Madura yang gurih dan lezat.",
    address: "Jl. Jend. Sudirman No. 108, 20 Ilir, Palembang",
    latitude: -2.9812,
    longitude: 104.757,
    category: "Sate & Nasi Goreng",
    rating: 4.7,
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Nasi_Goreng_Kampung_%2811967588375%29.jpg",
    created_at: "2026-09-16T12:00:00.000Z",
    menus: [
      {
        id: 201,
        name: "Nasi Goreng Spesial Kampung",
        description: "Nasi goreng bumbu rempah tradisional dengan telur ceplok dan kerupuk renyah",
        price: 22000,
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Nasi_Goreng_Kampung_%2811967588375%29.jpg",
      },
      {
        id: 202,
        name: "Sate Ayam Madura Bumbu Kacang",
        description: "10 tusuk sate daging ayam pilihan dibakar dengan kecap manis & bumbu kacang lembut",
        price: 28000,
        image: "https://dapoernde.com/wp-content/uploads/2025/11/sate-madura-by-dapoer-nde.webp",
      },
    ],
    reviews: [
      {
        id: 2001,
        user_name: "Siti Rahmawati",
        reviewer_name: "Siti Rahmawati",
        rating: 5,
        comment: "Nasi gorengnya harum dan sate ayamnya dagingnya tebal dengan bumbu kacang melimpah.",
        created_at: "2026-09-20 16:45:00",
      },
    ],
  },
  {
    id: 3,
    external_place_id: "demo-place-3",
    name: "Rumah Makan Padang Mande Mudo",
    description: "Sajian masakan Padang autentik dengan Rendang Sapi empuk bumbu rempah kaya rasa dan Gado-gado siram.",
    address: "Jl. KH. Azhari No. 10, 10 Ulu, Palembang",
    latitude: -2.992,
    longitude: 104.768,
    category: "Masakan Padang",
    rating: 4.9,
    image: "https://www.frisianflag.com/storage/app/media/uploaded-files/rendang-padang.jpg",
    created_at: "2026-09-17T12:00:00.000Z",
    menus: [
      {
        id: 301,
        name: "Rendang Sapi Daging Empuk",
        description: "Olahan daging sapi pilihan dimasak perlahan dengan santan & bumbu rempah Minang",
        price: 35000,
        image: "https://www.frisianflag.com/storage/app/media/uploaded-files/rendang-padang.jpg",
      },
      {
        id: 302,
        name: "Gado-Gado Siram Bumbu Kacang",
        description: "Sayuran segar rebus disiram bumbu kacang gurih dengan lontong & emping",
        price: 20000,
        image: "https://awsimages.detik.net.id/community/media/visual/2024/02/14/resep-gado-gado-siram.jpeg?w=1200",
      },
    ],
    reviews: [
      {
        id: 3001,
        user_name: "Rian Hidayat",
        reviewer_name: "Rian Hidayat",
        rating: 5,
        comment: "Rendangnya empuk meresap sampai ke serat daging terbukti bumbu autentik Padang.",
        created_at: "2026-09-22 19:10:00",
      },
    ],
  },
  {
    id: 4,
    external_place_id: "demo-place-4",
    name: "Warung Soto & Ayam Betutu Nusantara",
    description: "Kombinasi unik Ayam Betutu khas Bali yang kaya bumbu rempah serta Soto Betawi kuah santan gurih.",
    address: "Jl. Angkatan 45 No. 12, Lorok Pakjo, Palembang",
    latitude: -2.973,
    longitude: 104.742,
    category: "Soto & Kuliner Bali",
    rating: 4.8,
    image: "https://awsimages.detik.net.id/community/media/visual/2021/08/27/resep-ayam-betutu-gilimanuk_43.jpeg?w=1200",
    created_at: "2026-09-18T12:00:00.000Z",
    menus: [
      {
        id: 401,
        name: "Ayam Betutu Rempah Bali",
        description: "Ayam utuh diungkep bumbu betutu khas Gilimanuk Bali berselera pedas gurih",
        price: 45000,
        image: "https://awsimages.detik.net.id/community/media/visual/2021/08/27/resep-ayam-betutu-gilimanuk_43.jpeg?w=1200",
      },
      {
        id: 402,
        name: "Soto Betawi Kuah Santan Gurih",
        description: "Soto berisi potongan daging & jeroan sapi disiram kuah santan rempah hangat",
        price: 30000,
        image: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/ad396bfe9eb05b5fec49490dd2f05167/Derivates/d3f7d7e3c7ecc33becfbbdf50afc4d18470dde18.jpg",
      },
    ],
    reviews: [
      {
        id: 4001,
        user_name: "Maya Kartika",
        reviewer_name: "Maya Kartika",
        rating: 4.8,
        comment: "Ayam betutunya pedas gurih meresap, soto betawinya dagingnya empuk.",
        created_at: "2026-09-23 13:00:00",
      },
    ],
  },
  {
    id: 5,
    external_place_id: "demo-place-5",
    name: "Dapur Nasi Liwet & Bubur Manado Selera",
    description: "Sajian Nasi Liwet Solo komplit dan Tinutuan / Bubur Manado sehat kaya sayuran khas Nusantara.",
    address: "Jl. Merdeka No. 26 Ilir, Palembang",
    latitude: -2.988,
    longitude: 104.754,
    category: "Nasi Liwet & Kuliner Khas",
    rating: 4.8,
    image: "https://asset.kompas.com/crops/C1ocxE79PjRJv9oaJLJZbDdzbPo=/0x12:1000x679/1200x1200/data/photo/2021/01/29/60139260888f2.jpg",
    created_at: "2026-09-19T12:00:00.000Z",
    menus: [
      {
        id: 501,
        name: "Nasi Liwet Solo Komplit",
        description: "Nasi liwet gurih beraroma daun salam lengkap dengan suwiran ayam, telur & labu siam",
        price: 32000,
        image: "https://asset.kompas.com/crops/C1ocxE79PjRJv9oaJLJZbDdzbPo=/0x12:1000x679/1200x1200/data/photo/2021/01/29/60139260888f2.jpg",
      },
      {
        id: 502,
        name: "Tinutuan / Bubur Manado Sehat",
        description: "Bubur beras campur labu kuning, jagung, bayam & kangkung khas Manado",
        price: 25000,
        image: "https://asset.kompas.com/crops/GZP1r3C5qNg_J8bgVzQtupnPoBs=/81x22:892x563/1200x800/data/photo/2020/05/13/5ebbdec618a37.jpg",
      },
    ],
    reviews: [
      {
        id: 5001,
        user_name: "Doni Pratama",
        reviewer_name: "Doni Pratama",
        rating: 5,
        comment: "Nasi liwetnya gurih wangi aromatik, tinutuan/bubur manadonya sehat dan segar.",
        created_at: "2026-09-24 09:30:00",
      },
    ],
  },
];

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
      // Run fallback adb shell if direct push requires run-as
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
