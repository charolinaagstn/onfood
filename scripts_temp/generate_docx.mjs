import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  PageBreak,
  UnderlineType,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Helpers ────────────────────────────────────────────────────────────────

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "2563EB" },
    },
    run: { bold: true, color: "1E3A8A" },
  });
}

function heading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
    run: { color: "1D4ED8" },
  });
}

function heading3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 120 },
    run: { color: "2563EB" },
  });
}

function normalParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Calibri",
        ...options,
      }),
    ],
  });
}

function bulletPoint(text, bold = false) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Calibri",
        bold,
      }),
    ],
  });
}

function codeBlock(lines) {
  const paras = [];
  const codeLines = Array.isArray(lines) ? lines : [lines];
  for (const line of codeLines) {
    paras.push(
      new Paragraph({
        spacing: { before: 0, after: 0 },
        shading: {
          type: ShadingType.SOLID,
          color: "1E293B",
          fill: "1E293B",
        },
        children: [
          new TextRun({
            text: line,
            font: "Courier New",
            size: 18,
            color: "E2E8F0",
          }),
        ],
      })
    );
  }
  return paras;
}

function codeLabel(label) {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [
      new TextRun({
        text: `📄 ${label}`,
        bold: true,
        size: 20,
        font: "Calibri",
        color: "475569",
        italics: true,
      }),
    ],
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 } });
}

function infoRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                size: 22,
                font: "Calibri",
                color: "1E40AF",
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                size: 22,
                font: "Calibri",
                color: "1E293B",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ─── Document Content ────────────────────────────────────────────────────────

const doc = new Document({
  creator: "Abbu Solihin Alhakim",
  title: "Tugas Skema Junior Mobile Programmer - KulinerDekat",
  description: "Jawaban tugas BNSP skema Junior Mobile Programmer",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 24, color: "1E293B" },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      children: [
        // ─── HEADER ────────────────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          children: [
            new TextRun({
              text: "TUGAS SKEMA",
              bold: true,
              size: 28,
              font: "Calibri",
              color: "64748B",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 },
          children: [
            new TextRun({
              text: "Junior Mobile Programmer",
              bold: true,
              size: 48,
              font: "Calibri",
              color: "1E3A8A",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 400 },
          children: [
            new TextRun({
              text: "Aplikasi KulinerDekat — Expo React Native",
              size: 26,
              font: "Calibri",
              color: "2563EB",
              italics: true,
            }),
          ],
        }),

        // ─── INFO TABLE ───────────────────────────────────────────────────
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            infoRow("Nama", "Abbu Solihin Alhakim"),
            infoRow("Bidang", "Junior Mobile Programmer"),
            infoRow("Email", "alhakimabusolihin@gmail.com"),
            infoRow("Teknologi", "React Native + Expo (TypeScript)"),
            infoRow("Nama Aplikasi", "KulinerDekat"),
            infoRow("Package", "com.kulinerdekat.app"),
          ],
        }),
        spacer(),
        spacer(),

        // ═════════════════════════════════════════════════════════════════
        // SOAL 1
        // ═════════════════════════════════════════════════════════════════
        heading1("Soal 1: Pemilihan Platform OS dan Bahasa Pemrograman"),

        // 1.1
        heading2("1.1 Pemilihan Platform Operating System"),
        normalParagraph(
          "Dalam mengembangkan aplikasi KulinerDekat — sebuah aplikasi pencari tempat makan lokal — pemilihan platform OS merupakan keputusan strategis pertama yang harus diambil. Terdapat tiga opsi utama: Android, iOS, atau Cross-Platform (keduanya sekaligus)."
        ),
        heading3("Faktor-faktor Pertimbangan:"),
        bulletPoint("Target Audiens: Mayoritas pengguna smartphone di Indonesia menggunakan perangkat Android (>90% pangsa pasar per 2024). Namun segmen premium juga menggunakan iOS, sehingga menjangkau keduanya adalah ideal.", true),
        bulletPoint("Anggaran Startup: Mengembangkan dua aplikasi native secara terpisah membutuhkan biaya ganda. Cross-platform development dengan Expo/React Native memungkinkan satu codebase untuk dua platform, menghemat hingga 60% biaya pengembangan."),
        bulletPoint("Fitur yang Dibutuhkan: Aplikasi ini memerlukan GPS/Location, Kamera, Peta, dan Notifikasi — semua tersedia di Expo SDK tanpa konfigurasi native yang rumit."),
        bulletPoint("Time-to-Market: Startup memerlukan kecepatan iterasi. Cross-platform mempercepat siklus rilis secara signifikan."),
        normalParagraph(
          "Keputusan: Aplikasi KulinerDekat dikembangkan sebagai aplikasi Cross-Platform menggunakan Expo (Android & iOS) dengan satu codebase TypeScript/React Native. Ini memberikan coverage pengguna maksimal dengan biaya dan waktu pengembangan yang efisien."
        ),

        // 1.2
        heading2("1.2 Bahasa Pemrograman yang Tersedia"),
        normalParagraph("Berikut perbandingan bahasa pemrograman utama untuk pengembangan mobile:"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "1E3A8A", fill: "1E3A8A" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Bahasa", bold: true, color: "FFFFFF", size: 22, font: "Calibri" })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "1E3A8A", fill: "1E3A8A" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Platform", bold: true, color: "FFFFFF", size: 22, font: "Calibri" })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "1E3A8A", fill: "1E3A8A" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Kelebihan", bold: true, color: "FFFFFF", size: 22, font: "Calibri" })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "1E3A8A", fill: "1E3A8A" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Kekurangan", bold: true, color: "FFFFFF", size: 22, font: "Calibri" })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Java", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Android", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Mature, ekosistem besar, banyak library", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Verbose, hanya Android", size: 20, font: "Calibri" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Kotlin", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Android", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Modern, null-safe, ringkas, official Google", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hanya Android, perlu belajar Compose", size: 20, font: "Calibri" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Swift", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "iOS", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Performan tinggi, type-safe, modern syntax", size: 20, font: "Calibri" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hanya iOS, ekosistem terbatas", size: 20, font: "Calibri" })] })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
                  children: [new Paragraph({ children: [new TextRun({ text: "React Native + TypeScript ✓", bold: true, size: 20, font: "Calibri", color: "1E3A8A" })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Android + iOS", bold: true, size: 20, font: "Calibri", color: "1E3A8A" })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Satu codebase, ekosistem JS/TS besar, hot reload, Expo SDK", bold: true, size: 20, font: "Calibri", color: "1E3A8A" })] })],
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
                  children: [new Paragraph({ children: [new TextRun({ text: "Performa sedikit di bawah native untuk animasi berat", size: 20, font: "Calibri", color: "1E3A8A" })] })],
                }),
              ],
            }),
          ],
        }),

        spacer(),
        heading2("1.3 Bahasa yang Dipilih: TypeScript + React Native (Expo)"),
        normalParagraph(
          "TypeScript dipilih sebagai bahasa pemrograman utama KulinerDekat karena: (1) Type safety mencegah bug runtime yang umum terjadi pada JavaScript murni; (2) IntelliSense dan autocompletion mempercepat pengembangan; (3) Satu codebase untuk Android dan iOS; (4) Ekosistem npm yang sangat kaya dengan ribuan library siap pakai; (5) Expo SDK menyediakan akses mudah ke fitur native seperti GPS, kamera, dan notifikasi tanpa konfigurasi native yang kompleks."
        ),

        codeLabel("src/types/place.ts — Type definitions TypeScript"),
        ...codeBlock([
          "export interface Place {",
          "  id: number;",
          "  external_place_id?: string;",
          "  name: string;",
          "  description?: string;",
          "  address: string;",
          "  latitude: number;",
          "  longitude: number;",
          "  category: string;",
          "  rating: number;",
          "  image?: string;",
          "  image_url?: string;",
          "  created_at: string;",
          "}",
          "",
          "export interface Menu {",
          "  id: number;",
          "  place_id: number;",
          "  name: string;",
          "  description: string;",
          "  price: number;",
          "  image?: string;",
          "}",
          "",
          "export interface Review {",
          "  id: number;",
          "  place_id: number;",
          "  user_name: string;",
          "  rating: number;",
          "  comment: string;",
          "  created_at: string;",
          "}",
        ]),

        spacer(),
        heading2("1.4 IDE dan Alat Pengembangan"),
        bulletPoint("Visual Studio Code: IDE utama dengan ekstensi TypeScript, ESLint, Prettier, dan Expo Tools."),
        bulletPoint("Expo CLI: Menjalankan Metro bundler dan OTA updates dengan perintah `npx expo start`."),
        bulletPoint("Android Studio / Xcode: Emulator dan simulator untuk testing native."),
        bulletPoint("Expo Go: Aplikasi untuk preview langsung di perangkat fisik."),
        bulletPoint("ESLint + Prettier: Linting dan formatting kode otomatis (eslint.config.js sudah dikonfigurasi)."),
        bulletPoint("Git + GitHub: Version control dan kolaborasi tim."),

        codeLabel("package.json — Dependencies utama KulinerDekat"),
        ...codeBlock([
          '{',
          '  "name": "KulinerDekat",',
          '  "dependencies": {',
          '    "expo": "~57.0.0",',
          '    "expo-router": "~5.1.0",',
          '    "expo-sqlite": "~15.2.0",',
          '    "expo-location": "~18.1.0",',
          '    "react-native-maps": "~1.20.1",',
          '    "react-native": "0.79.5",',
          '    "typescript": "~5.8.3"',
          '  },',
          '  "scripts": {',
          '    "start": "expo start",',
          '    "android": "expo run:android",',
          '    "ios": "expo run:ios"',
          '  }',
          '}',
        ]),

        // PAGE BREAK
        new Paragraph({ children: [new PageBreak()] }),

        // ═════════════════════════════════════════════════════════════════
        // SOAL 2
        // ═════════════════════════════════════════════════════════════════
        heading1("Soal 2: Perancangan Database dan Data Persistence"),

        heading2("2.1 Jenis-jenis Database untuk Mobile"),
        normalParagraph("Terdapat beberapa pilihan database untuk aplikasi mobile, masing-masing dengan karakteristik berbeda:"),
        bulletPoint("SQLite: Database relasional berbasis file yang tersimpan lokal di perangkat. Ringan, tidak memerlukan server, dan didukung secara native di Android/iOS. Cocok untuk data terstruktur yang bersifat lokal.", true),
        bulletPoint("Realm: Database berorientasi objek yang menawarkan performa tinggi dan reactive queries. Lebih mudah digunakan dibanding SQLite namun ukuran library lebih besar."),
        bulletPoint("Firebase Firestore: Database cloud NoSQL real-time. Ideal untuk sinkronisasi multi-device dan kolaborasi, tetapi memerlukan koneksi internet dan biaya berlangganan."),
        bulletPoint("AsyncStorage: Key-value store sederhana di React Native. Cocok untuk menyimpan preferensi pengguna, bukan data terstruktur kompleks."),
        bulletPoint("WatermelonDB: Database high-performance untuk React Native dengan lazy loading dan observability, cocok untuk dataset sangat besar."),

        heading2("2.2 Database yang Dipilih: SQLite via expo-sqlite"),
        normalParagraph(
          "KulinerDekat menggunakan SQLite melalui expo-sqlite karena: (1) Data tempat makan bersifat lokal dan tidak memerlukan sinkronisasi cloud real-time; (2) Bekerja secara offline tanpa koneksi internet; (3) Performa query cepat untuk dataset skala startup; (4) expo-sqlite v15 mendukung async API modern yang tidak memblokir UI thread; (5) Gratis tanpa biaya backend tambahan — ideal untuk startup."
        ),

        heading2("2.3 Skema Database"),
        normalParagraph("Berikut adalah skema database yang dirancang untuk KulinerDekat:"),

        codeLabel("src/lib/database/database.ts — Inisialisasi & Skema SQLite"),
        ...codeBlock([
          'import * as SQLite from "expo-sqlite";',
          '',
          'let dbInstance: SQLite.SQLiteDatabase | null = null;',
          '',
          'export async function getDb(): Promise<SQLite.SQLiteDatabase> {',
          '  if (!dbInstance) {',
          '    dbInstance = await SQLite.openDatabaseAsync("kuliner_dekat.db");',
          '    await dbInstance.execAsync("PRAGMA foreign_keys = ON;");',
          '  }',
          '  return dbInstance;',
          '}',
          '',
          'export async function initDatabase(): Promise<void> {',
          '  const db = await getDb();',
          '  await db.execAsync(`',
          '    CREATE TABLE IF NOT EXISTS places (',
          '      id            INTEGER PRIMARY KEY AUTOINCREMENT,',
          '      external_place_id TEXT,',
          '      name          TEXT NOT NULL,',
          '      description   TEXT,',
          '      address       TEXT NOT NULL,',
          '      latitude      REAL NOT NULL,',
          '      longitude     REAL NOT NULL,',
          '      category      TEXT NOT NULL,',
          '      rating        REAL NOT NULL,',
          '      image         TEXT,',
          '      created_at    TEXT NOT NULL',
          '    );',
          '',
          '    CREATE TABLE IF NOT EXISTS menus (',
          '      id          INTEGER PRIMARY KEY AUTOINCREMENT,',
          '      place_id    INTEGER NOT NULL,',
          '      name        TEXT NOT NULL,',
          '      description TEXT NOT NULL,',
          '      price       INTEGER NOT NULL,',
          '      image       TEXT,',
          '      FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE',
          '    );',
          '',
          '    CREATE TABLE IF NOT EXISTS reviews (',
          '      id          INTEGER PRIMARY KEY AUTOINCREMENT,',
          '      place_id    INTEGER NOT NULL,',
          '      user_name   TEXT NOT NULL,',
          '      rating      REAL NOT NULL,',
          '      comment     TEXT NOT NULL,',
          '      created_at  TEXT NOT NULL,',
          '      FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE',
          '    );',
          '  `);',
          '}',
        ]),

        spacer(),
        heading2("2.4 ORM dan Data Persistence"),
        normalParagraph(
          "KulinerDekat menggunakan pendekatan custom repository pattern sebagai pengganti ORM penuh. Setiap tabel memiliki modul tersendiri (places.ts, menus.ts, reviews.ts) yang mengenkapsulasi semua operasi database. Pendekatan ini memberikan kontrol penuh atas query SQL dengan type-safety TypeScript."
        ),

        codeLabel("src/lib/database/places.ts — Repository Pattern"),
        ...codeBlock([
          'import { Place } from "@/types/place";',
          'import { getDb } from "./database";',
          '',
          '// Mengambil semua tempat makan',
          'export async function getPlaces(): Promise<Place[]> {',
          '  const db = await getDb();',
          '  return db.getAllAsync<Place>("SELECT * FROM places ORDER BY id ASC;");',
          '}',
          '',
          '// Mengambil tempat makan berdasarkan ID',
          'export async function getPlaceById(id: number): Promise<Place | null> {',
          '  const db = await getDb();',
          '  const place = await db.getFirstAsync<Place>(',
          '    "SELECT * FROM places WHERE id = ?;", [id]',
          '  );',
          '  return place ?? null;',
          '}',
          '',
          '// Pencarian dengan filter nama, alamat, dan kategori',
          'export async function searchPlaces(',
          '  query: string = "",',
          '  category: string = "all"',
          '): Promise<Place[]> {',
          '  const db = await getDb();',
          '  let sql = "SELECT * FROM places WHERE 1=1";',
          '  const params: (string | number)[] = [];',
          '',
          '  if (query.trim().length > 0) {',
          '    const term = `%${query.trim().toLowerCase()}%`;',
          '    sql += " AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ?)";',
          '    params.push(term, term);',
          '  }',
          '',
          '  if (category && category !== "all") {',
          '    sql += " AND LOWER(category) LIKE ?";',
          '    params.push(`%${category.toLowerCase()}%`);',
          '  }',
          '',
          '  return db.getAllAsync<Place>(sql + " ORDER BY id ASC;", params);',
          '}',
        ]),

        // PAGE BREAK
        new Paragraph({ children: [new PageBreak()] }),

        // ═════════════════════════════════════════════════════════════════
        // SOAL 3
        // ═════════════════════════════════════════════════════════════════
        heading1("Soal 3: Pengembangan Mobile Location Based Service (LBS)"),

        heading2("3.1 API dan Library untuk LBS"),
        normalParagraph("Tersedia berbagai API dan library untuk pengembangan fitur berbasis lokasi:"),
        bulletPoint("expo-location: Library Expo resmi untuk mengakses GPS perangkat. Mendukung foreground/background location, reverse geocoding, dan geocoding.", true),
        bulletPoint("react-native-maps: Library peta interaktif untuk React Native yang mendukung Google Maps (Android) dan Apple Maps (iOS) dengan komponen MapView, Marker, dan Polyline."),
        bulletPoint("Google Maps API: API web untuk routing, Places, Directions, dan Geocoding. Dapat dibuka melalui deep link dari aplikasi."),
        bulletPoint("Core Location (iOS native): Framework Apple untuk location tracking, geofencing, dan iBeacon. Diakses melalui expo-location di React Native."),
        bulletPoint("Mapbox SDK: Alternatif Google Maps dengan lebih banyak opsi kustomisasi peta, namun memerlukan API key berbayar."),

        heading2("3.2 API yang Dipilih untuk KulinerDekat"),
        normalParagraph(
          "KulinerDekat menggunakan kombinasi: (1) expo-location untuk akses GPS dan reverse geocoding — memberikan koordinat pengguna secara real-time; (2) react-native-maps untuk menampilkan peta interaktif dengan marker tempat makan; (3) Google Maps via deep link untuk navigasi turn-by-turn eksternal. Kombinasi ini tidak memerlukan API key berbayar untuk fungsi dasar, cocok untuk startup dengan anggaran terbatas."
        ),

        codeLabel("src/lib/location.ts — Mendapatkan Lokasi Pengguna (GPS)"),
        ...codeBlock([
          'import * as Location from "expo-location";',
          'import { Platform } from "react-native";',
          '',
          'export type CurrentUserLocation = {',
          '  latitude: number;',
          '  longitude: number;',
          '  address: string;',
          '};',
          '',
          'export async function getCurrentUserLocation(): Promise<CurrentUserLocation> {',
          '  // 1. Minta izin lokasi dari pengguna',
          '  const { status } = await Location.requestForegroundPermissionsAsync();',
          '  if (status !== "granted") {',
          '    throw new Error("Izin lokasi ditolak. Aktifkan GPS untuk fitur ini.");',
          '  }',
          '',
          '  // 2. Aktifkan high-accuracy di Android',
          '  if (Platform.OS === "android") {',
          '    try { await Location.enableNetworkProviderAsync(); } catch {}',
          '  }',
          '',
          '  // 3. Dapatkan koordinat GPS',
          '  let location = await Location.getCurrentPositionAsync({',
          '    accuracy: Location.Accuracy.Balanced,',
          '  });',
          '',
          '  const coords = {',
          '    latitude: location.coords.latitude,',
          '    longitude: location.coords.longitude,',
          '  };',
          '',
          '  // 4. Reverse geocoding: koordinat → nama jalan/kota',
          '  const [geocoded] = await Location.reverseGeocodeAsync(coords);',
          '  const parts = [geocoded?.name, geocoded?.street, geocoded?.city].filter(Boolean);',
          '  const address = parts.join(", ") || `${coords.latitude}, ${coords.longitude}`;',
          '',
          '  return { ...coords, address };',
          '}',
          '',
          '// Formula Haversine: menghitung jarak dua titik GPS dalam kilometer',
          'export function calculateDistance(',
          '  lat1: number, lon1: number, lat2: number, lon2: number',
          '): number {',
          '  const toRad = (v: number) => (v * Math.PI) / 180;',
          '  const R = 6371; // Radius bumi dalam km',
          '  const dLat = toRad(lat2 - lat1);',
          '  const dLon = toRad(lon2 - lon1);',
          '  const a = Math.sin(dLat/2)**2 +',
          '            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *',
          '            Math.sin(dLon/2)**2;',
          '  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;',
          '}',
        ]),

        spacer(),
        codeLabel("src/lib/navigation.ts — Membuka Navigasi Eksternal (Google Maps)"),
        ...codeBlock([
          'import { Alert, Linking, Platform } from "react-native";',
          '',
          'export async function openExternalNavigation({',
          '  latitude, longitude, name, userLatitude, userLongitude',
          '}: {',
          '  latitude: number; longitude: number; name: string;',
          '  userLatitude?: number | null; userLongitude?: number | null;',
          '}): Promise<void> {',
          '  const encoded = encodeURIComponent(name);',
          '',
          '  // URL Google Maps dengan rute dari posisi pengguna ke tujuan',
          '  const gmapsUrl = userLatitude && userLongitude',
          '    ? `https://www.google.com/maps/dir/?api=1` +',
          '      `&origin=${userLatitude},${userLongitude}` +',
          '      `&destination=${latitude},${longitude}`',
          '    : `https://www.google.com/maps/dir/?api=1` +',
          '      `&destination=${latitude},${longitude}`;',
          '',
          '  // Fallback: geo URI untuk Android / Apple Maps untuk iOS',
          '  const fallbackUrl = Platform.OS === "android"',
          '    ? `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encoded})`',
          '    : `http://maps.apple.com/?daddr=${latitude},${longitude}`;',
          '',
          '  try {',
          '    if (await Linking.canOpenURL(gmapsUrl)) {',
          '      await Linking.openURL(gmapsUrl);',
          '    } else {',
          '      await Linking.openURL(fallbackUrl);',
          '    }',
          '  } catch {',
          '    Alert.alert("Error", "Tidak dapat membuka aplikasi navigasi.");',
          '  }',
          '}',
        ]),

        spacer(),
        heading2("3.3 Antarmuka Pengguna (UI) untuk Fitur LBS"),
        normalParagraph(
          "UI LBS pada KulinerDekat dirancang dengan prinsip intuitif dan informatif: (1) Peta interaktif ditampilkan sebagai thumbnail preview di halaman detail tempat makan dengan ukuran 192px (h-48); (2) Marker custom menandai lokasi tempat makan dengan highlight khusus untuk tempat yang sedang dipilih; (3) Badge jarak dinamis (mis. '1.2 km dari posisi Anda') ditampilkan di samping kategori tempat makan; (4) Tombol CTA 'Petunjuk Arah (Buka Google Maps)' memudahkan navigasi turn-by-turn; (5) Tampilan fallback emoji 🍲 saat gambar tidak tersedia."
        ),

        codeLabel("src/app/place/[id].tsx — UI Detail Tempat dengan Peta & Navigasi"),
        ...codeBlock([
          'import { calculateDistance, getCurrentUserLocation } from "@/lib/location";',
          'import { openExternalNavigation } from "@/lib/navigation";',
          'import RestaurantMap from "@/components/RestaurantMap";',
          '',
          'export default function RestaurantDetailScreen() {',
          '  const [restaurant, setRestaurant] = useState<Place | null>(null);',
          '  const [userCoords, setUserCoords] = useState<{',
          '    latitude: number; longitude: number;',
          '  } | null>(null);',
          '',
          '  useEffect(() => {',
          '    async function loadData() {',
          '      // Load data restoran dan lokasi pengguna secara paralel',
          '      const [place] = await Promise.all([',
          '        getPlaceById(placeId),',
          '      ]);',
          '      setRestaurant(place);',
          '',
          '      try {',
          '        const userLoc = await getCurrentUserLocation();',
          '        setUserCoords(userLoc);',
          '      } catch { /* GPS unavailable */ }',
          '    }',
          '    loadData();',
          '  }, [id]);',
          '',
          '  // Hitung jarak menggunakan formula Haversine',
          '  const distanceKm = restaurant && userCoords',
          '    ? calculateDistance(',
          '        userCoords.latitude, userCoords.longitude,',
          '        restaurant.latitude, restaurant.longitude',
          '      )',
          '    : undefined;',
          '',
          '  return (',
          '    <SafeAreaView>',
          '      {/* Badge jarak dinamis */}',
          '      {distanceKm !== undefined && (',
          '        <Text>📏 {distanceKm} km dari posisi Anda</Text>',
          '      )}',
          '',
          '      {/* Peta Interaktif */}',
          '      <View style={{ height: 192, borderRadius: 16, overflow: "hidden" }}>',
          '        <RestaurantMap',
          '          userLatitude={userCoords?.latitude ?? null}',
          '          userLongitude={userCoords?.longitude ?? null}',
          '          restaurants={[restaurant]}',
          '          selectedRestaurantId={restaurant.id}',
          '        />',
          '      </View>',
          '',
          '      {/* Tombol Navigasi ke Google Maps */}',
          '      <TouchableOpacity onPress={() => openExternalNavigation({',
          '        latitude: restaurant.latitude,',
          '        longitude: restaurant.longitude,',
          '        name: restaurant.name,',
          '        userLatitude: userCoords?.latitude,',
          '        userLongitude: userCoords?.longitude,',
          '      })}>',
          '        <Text>🧭 Petunjuk Arah (Buka Google Maps)</Text>',
          '      </TouchableOpacity>',
          '    </SafeAreaView>',
          '  );',
          '}',
        ]),

        spacer(),
        heading2("3.4 Pengujian Akurasi Fitur LBS"),
        normalParagraph("Strategi pengujian LBS pada KulinerDekat mencakup:"),
        bulletPoint("Unit Testing Formula Haversine: Validasi calculateDistance() dengan koordinat yang diketahui jaraknya (mis. Jakarta ke Bandung ≈ 150 km).", true),
        bulletPoint("Emulator GPS Simulation: Android Studio menyediakan Extended Controls → Location untuk mengatur koordinat GPS virtual selama development."),
        bulletPoint("Device Testing: Uji di perangkat fisik di berbagai kondisi (indoor, outdoor, kendaraan bergerak) untuk mengukur akurasi GPS nyata."),
        bulletPoint("Permission Handling Test: Uji skenario penolakan izin lokasi dan pastikan error handling berjalan dengan benar."),
        bulletPoint("Fallback Testing: Validasi bahwa aplikasi tetap berfungsi saat GPS tidak tersedia (misalnya menggunakan koordinat default)."),
        bulletPoint("Deep Link Testing: Verifikasi bahwa Google Maps terbuka dengan rute yang benar dari lokasi pengguna ke tempat makan tujuan."),
        bulletPoint("Cross-platform Testing: Pastikan peta dan navigasi bekerja konsisten di Android (Google Maps) dan iOS (Apple Maps fallback)."),

        codeLabel("Contoh Unit Test Formula Haversine"),
        ...codeBlock([
          '// __tests__/location.test.ts',
          'import { calculateDistance } from "@/lib/location";',
          '',
          'describe("calculateDistance", () => {',
          '  test("jarak Jakarta ke Bandung sekitar 150 km", () => {',
          '    // Jakarta: -6.2088, 106.8456',
          '    // Bandung: -6.9175, 107.6191',
          '    const distance = calculateDistance(-6.2088, 106.8456, -6.9175, 107.6191);',
          '    expect(distance).toBeGreaterThan(120);',
          '    expect(distance).toBeLessThan(180);',
          '  });',
          '',
          '  test("jarak titik sama harus nol", () => {',
          '    const distance = calculateDistance(-6.2, 106.8, -6.2, 106.8);',
          '    expect(distance).toBe(0);',
          '  });',
          '});',
        ]),

        spacer(),
        spacer(),

        // ─── PENUTUP ──────────────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 },
          shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
          children: [
            new TextRun({
              text: "Disusun oleh: Abbu Solihin Alhakim  |  alhakimabusolihin@gmail.com  |  Junior Mobile Programmer",
              size: 20,
              font: "Calibri",
              color: "1E3A8A",
              italics: true,
            }),
          ],
        }),
      ],
    },
  ],
});

// ─── Write File ─────────────────────────────────────────────────────────────

const outputPath = path.join(
  __dirname,
  "..",
  "Tugas_Junior_Mobile_Programmer_Abbu_Solihin_Alhakim.docx"
);

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ File berhasil dibuat: ${outputPath}`);
});
