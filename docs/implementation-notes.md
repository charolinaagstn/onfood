# KulinerDekat Technical Implementation Notes

This document provides a comprehensive technical overview of the **KulinerDekat** (FoodieBuddy) mobile application refinement, database architecture, and LBS functionality.

---

## 1. Project Overview & Architecture

**KulinerDekat** is a React Native mobile application built with TypeScript, Expo SDK 57, NativeWind (Tailwind CSS), and Expo SQLite (`expo-sqlite`). It allows Indonesian users to discover local food places through interactive map markers and structured restaurant profiles.

### Key Architecture Components:
- **UI Framework**: React Native + NativeWind v4.2.7 for utility-first responsive styling.
- **Routing**: Expo Router file-based navigation (`src/app/index.tsx` for Home and `src/app/place/[id].tsx` for Restaurant Detail).
- **Data Persistence**: Local SQLite database (`kuliner_dekat.db`) accessed via direct `expo-sqlite` DDL/queries without cloud server dependencies.
- **Location Services (LBS)**: `expo-location` for device GPS position and `react-native-maps` for interactive map display.

---

## 2. Database Schema & Persistence

The application uses an embedded relational SQLite database with three core tables and alias views to ensure data integrity and query compatibility.

```text
  +-------------------+
  |      PLACES       |
  +-------------------+
  | PK  id            |
  |     name          |
  |     description   |
  |     address       |
  |     latitude      |
  |     longitude     |
  |     category      |
  |     rating        |
  |     image / url   |
  |     created_at    |
  +---------+---------+
            |
            | 1 : N (One-to-Many)
            +-----------------------+
            |                       |
  +---------v---------+   +---------v---------+
  |       MENUS       |   |      REVIEWS      |
  +-------------------+   +-------------------+
  | PK  id            |   | PK  id            |
  | FK  place_id      |   | FK  place_id      |
  |     name          |   |     user_name     |
  |     description   |   |     rating        |
  |     price         |   |     comment       |
  |     image / url   |   |     created_at    |
  +-------------------+   +-------------------+
```

### Schema Features:
- **`places`** (alias view `restaurants`): Stores restaurant profiles, coordinates, rating, categories, and hero images.
- **`menus`** (alias view `menu_items`): Stores menu items linked via `place_id` (foreign key) with item descriptions, prices (IDR), and food images.
- **`reviews`**: Stores visitor reviews linked via `place_id` with reviewer names, star ratings, and comments.

---

## 3. Database Seed Command (`npm run db:seed`)

The application includes a repeatable CLI database seed script available via:

```bash
npm run db:seed
```

### Seed Script Implementation (`scripts/seed-demo.ts` & `scripts/db-seed.js`):
1. **Target File**: Modifies the same SQLite database file (`kuliner_dekat.db`) consumed by the application runtime.
2. **Idempotency**: Uses `INSERT OR REPLACE` statements to guarantee that executing `npm run db:seed` multiple times will **never create duplicate rows**.
3. **Data Content**: Seeds 5 realistic demo restaurant profiles around Palembang with 10 Indonesian food images (Nasi Goreng, Sate Madura, Rendang Sapi, Pempek, Ayam Betutu, Soto Betawi, Gado-Gado, Nasi Liwet, Bubur Manado, Es Cendol Dawet).
4. **ADB Device Sync**: Automatically detects connected Android emulators/devices via ADB and pushes updated database binaries directly to the application sandbox (`/data/data/com.kulinerdekat.app/databases/kuliner_dekat.db`).

---

## 4. Map Discovery & In-App Marker Preview

The map interaction focuses on **in-app discovery** rather than immediate external navigation.

### Map Workflow:
1. User views interactive map (`RestaurantMap.tsx`) centered on their GPS position or Palembang default.
2. Tapping a food marker (🍴) opens an **in-app marker preview card** (`RestaurantPreviewCard.tsx`).
3. The preview card displays the restaurant image, name, category, rating, address, and distance.
4. Tapping **"Lihat Detail"** navigates the user to the full Restaurant Detail profile page (`src/app/place/[id].tsx`).
5. External Google Maps navigation remains an optional secondary action (**"Petunjuk Arah"**) on the detail page.

---

## 5. Mobile LBS & Distance Calculation

Distance in kilometers is computed dynamically between user GPS coordinates \((lat_1, lon_1)\) and restaurant coordinates \((lat_2, lon_2)\) using the Haversine formula:

\[
d = 2 \cdot R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta lat}{2}\right) + \cos(lat_1)\cos(lat_2)\sin^2\left(\frac{\Delta lon}{2}\right)}\right)
\]

where \(R = 6371\text{ km}\).
