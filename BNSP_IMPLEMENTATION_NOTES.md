# DOKUMENTASI IMPLEMENTASI BNSP — KulinerDekat

Dokumen ini disusun untuk memenuhi kriteria penilaian dan asesmen sertifikasi **BNSP Junior Mobile Programmer** pada proyek aplikasi mobile **KulinerDekat**.

---

## 1. SOAL 1 — Platform Operating System & Programming Language

### 1.1 Pemilihan Platform & Bahasa Pemrograman
Aplikasi **KulinerDekat** dikembangkan menggunakan **React Native** dengan bahasa pemrograman **TypeScript** di atas kerangka kerja **Expo** dan menargetkan **Android** sebagai sistem operasi utama (*primary OS target*).

#### Alasan Pemilihan React Native + Expo untuk Startup / Proyek Sertifikasi:
1. **Efisiensi Anggaran & Sumber Daya (*Budget & Resource Efficiency*)**:
   Menggunakan React Native memungkinkan pengembangan lintas platform (*cross-platform*) dari satu basis kode (*single codebase*). Tim pengembangan tidak perlu menulis dua kode terpisah dalam Java/Kotlin (Android) dan Swift (iOS), sehingga memangkas biaya dan waktu pengembangan hingga 50%.
2. **Kesesuaian dengan Pasar Target Android**:
   Di Indonesia, pangsa pasar perangkat Android mencapai lebih dari 85%. Pendekatan *Android-first* merupakan strategi rasional untuk aplikasi pencari kuliner lokal berskala awal.
3. **Keunggulan TypeScript**:
   TypeScript memberikan *static type checking*, mengurangi potensi *runtime error* (seperti `null pointer` atau `undefined property`), dan meningkatkan keterbacaan kode saat asesmen sertifikasi.
4. **Ekosistem Expo**:
   Expo menyediakan pustaka standar yang teruji seperti `expo-location` dan `expo-sqlite`, mempercepat proses konfigurasi build Android (APK) dan pengujian perangkat.

---

### 1.2 Perbandingan Teknologi Mobile Development

| Kriteria | Java (Android Native) | Kotlin (Android Native) | Swift (iOS Native) | React Native (TypeScript) |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Target** | Android | Android | iOS | Android & iOS (Cross-platform) |
| **Kecepatan Dev** | Sedang | Sedang-Tinggi | Sedang-Tinggi | Sangat Tinggi |
| **Biaya Dev** | Tinggi (Butuh 2 team) | Tinggi (Butuh 2 team) | Tinggi (Khusus Apple) | Hemat (Satu tim/developer) |
| **Performa Map/LBS**| Sangat Tinggi | Sangat Tinggi | Sangat Tinggi | Tinggi (Native Bridge) |
| **Penyimpanan Lokal**| Room / SQLite | Room / SQLite | CoreData / SQLite | `expo-sqlite` / SQLite |
| **Kesesuaian Proyek**| Enterprise Android | Enterprise Android | Enterprise iOS | Startup / BNSP Assessment |

---

## 2. SOAL 2 — Database and Data Persistence

### 2.1 Pemilihan SQLite & Perbandingan Persistence Layer
Aplikasi menggunakan **SQLite** melalui pustaka `expo-sqlite` untuk menyimpan data relasional tempat kuliner, menu, dan ulasan pengunjung secara lokal pada perangkat pengguna.

#### Perbandingan Alternatif Database Mobile:
* **SQLite (Dipilih)**: Database relasional ringan terintegrasi tanpa server (*serverless*). Sangat stabil, mendukung SQL standar (DDL/DML), foreign keys, dan transaksi ACID tanpa biaya infrastruktur cloud.
* **Realm**: Database objek berorientasi dokumen. Baik untuk sinkronisasi kompleks, tetapi menambah dependensi pustaka yang lebih berat untuk skema data sederhana.
* **Firebase Realtime DB / Firestore**: Database NoSQL berbasis cloud. Memerlukan koneksi internet aktif, kuota akun cloud, dan biaya berulang (*recurring cloud cost*).

> **Catatan Arsitektur Persistence**:
> *"An ORM was considered, but direct SQLite access through a lightweight persistence/data-access layer was chosen because the application's data model is small and the implementation is simpler for this project."*

---

### 2.2 Skema Database & Diagram Relasi (ERD)

#### Entity Relationship Diagram (ERD):
```text
  +-------------------+
  |      PLACES       |
  +-------------------+
  | PK  id            |
  |     name          |
  |     address       |
  |     latitude      |
  |     longitude     |
  |     category      |
  |     rating        |
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
  +-------------------+   |     created_at    |
                          +-------------------+
```

#### Struktur Data Access Layer (`src/lib/database/`):
* `database.ts`: Membuka file database `kuliner_dekat.db`, membuat tabel DDL, dan menjalankan *idempotent seed initialization*.
* `places.ts`: Menyediakan fungsi `getPlaces()`, `getPlaceById(id)`, `searchPlaces()`, dan `insertPlace()`.
* `menus.ts`: Menyediakan fungsi `getMenusByPlaceId(placeId)` dan `insertMenu()`.
* `reviews.ts`: Menyediakan fungsi `getReviewsByPlaceId(placeId)` dan `insertReview()`.

---

## 3. SOAL 3 — Mobile Location Based Service (LBS)

### 3.1 Komponen & Teknologi LBS
1. **Google Maps SDK (`react-native-maps`)**: Digunakan untuk menampilkan peta interaktif, menandai posisi pengguna, dan meletakkan marker restoran.
2. **GPS & Device Location (`expo-location`)**: Membaca koordinat GPS pengguna secara langsung dari perangkat Android.
3. **Pencarian & Penyaringan Berbasis Lokasi**: Menggunakan rumus **Haversine** untuk mengukur jarak linier antara posisi pengguna (Lat/Lng) dan lokasi kuliner dalam satuan kilometer.
4. **Navigasi Eksternal**: Membuka Google Maps aplikasi eksternal melalui URL Scheme / Intent (`https://www.google.com/maps/dir/?api=1...` atau `geo:`).

> **Catatan Teknologi LBS**:
> *"Core Location is an iOS-native alternative, while this project uses Expo Location because the application is built with React Native/Expo and targets Android primarily."*

---

### 3.2 Rumus Haversine untuk Perhitungan Jarak
Jarak linier antara koordinat pengguna \((lat_1, lon_1)\) dan lokasi kuliner \((lat_2, lon_2)\) dihitung menggunakan rumus Haversine:

\[
a = \sin^2\left(\frac{\Delta lat}{2}\right) + \cos(lat_1) \cdot \cos(lat_2) \cdot \sin^2\left(\frac{\Delta lon}{2}\right)
\]
\[
c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right), \quad d = R \cdot c \quad (R = 6371 \text{ km})
\]

---

### 3.3 Pengujian Akurasi LBS (Location Accuracy Testing)

#### Metode Pengujian Akurasi GPS:
1. **Pengujian Emulator Android**:
   * Membuka fitur *Extended Controls* (Location) di Android Studio Emulator.
   * Mengatur simulasi titik GPS pada beberapa lokasi di Palembang (misalnya: Simpang Lima R. Sukamto, Benteng Kuto Besak, Bukit Besar).
   * Mengamati pembaruan koordinat GPS dan perubahan jarak pada kartu kuliner.

2. **Pengujian Perangkat Fisik (Physical Device)**:
   * Menguji aplikasi di bawah kondisi langit terbuka (*Open Sky*) dan di dalam ruangan (*Indoor*).
   * Membandingkan koordinat GPS dari `expo-location` dengan aplikasi Google Maps bawaan.
   * Mengukur *Accuracy Metric* (dalam meter) yang dikembalikan oleh API `Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })`.

---

## 4. Analisis Anggaran & Pertimbangan Bisnis (Budget Considerations)

1. **Biaya Infrastruktur Server**: Rp 0,- (Memanfatkan SQLite lokal di perangkat, menghindari server database cloud bulanan).
2. **Biaya Lisensi Peta**: Penggunaan `react-native-maps` standar dengan ubin peta gratis (*free map tiles* / Google Maps SDK free tier) mengurangi biaya API.
3. **Waktu Pengembangan**: Pengembangan satu kode React Native menghemat durasi proyek dari 3 bulan menjadi 3-4 minggu.
4. **Biaya Pemeliharaan**: Pemeliharaan satu basis kode React Native jauh lebih hemat bagi startup awal daripada mengelola tim Android (Kotlin) dan tim iOS (Swift) secara terpisah.
