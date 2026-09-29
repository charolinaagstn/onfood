# KulinerDekat 🍲

**KulinerDekat** adalah aplikasi mobile berbasis lokasi (*Location Based Service*) yang membantu pengguna menemukan tempat kuliner lokal di sekitar posisi mereka, melihat daftar menu dan ulasan pengunjung, serta membuka navigasi langsung ke tempat kuliner yang dipilih.

Aplikasi ini dikembangkan menggunakan **React Native**, **Expo**, **TypeScript**, dan **SQLite** (`expo-sqlite`) untuk memenuhi kebutuhan asesmen sertifikasi **BNSP Junior Mobile Programmer**.

---

## 🚀 Fitur Utama

- 🏠 **Beranda & Tanpa Otentikasi**: Aplikasi langsung masuk ke halaman utama tanpa hambatan login/register.
- 📍 **LBS & GPS (`expo-location`)**: Mendapatkan lokasi GPS pengguna saat ini dan menampilkan koordinat/alamat terkini.
- 🗺️ **Peta Interaktif (`react-native-maps`)**: Menampilkan peta lokasi beserta penanda (*markers*) tempat kuliner.
- 🔍 **Pencarian & Penyaringan**: Cari kuliner berdasarkan nama, kategori (pempek, bakso, cafe, martabak), atau filter terdekat / rating tertinggi.
- 💾 **Data Persistence SQLite (`expo-sqlite`)**: Data tempat kuliner, menu, dan ulasan tersimpan secara persistent di database lokal relasional.
- 📖 **Detail Tempat Kuliner**: Menampilkan informasi lengkap, daftar menu dengan harga, ulasan pengguna, dan peta lokasi mini.
- 🧭 **Integrasi Navigasi Eksternal**: Membuka Google Maps aplikasi eksternal untuk petunjuk arah menuju tempat kuliner.

---

## 📁 Dokumentasi BNSP

- [`BNSP_IMPLEMENTATION_NOTES.md`](./BNSP_IMPLEMENTATION_NOTES.md) — Jawaban dan penjelasan teknis lengkap untuk SOAL 1, SOAL 2, SOAL 3, arsitektur database, dan pertimbangan anggaran.
- [`BNSP_TEST_CASES.md`](./BNSP_TEST_CASES.md) — Skenario dan hasil pengujian 9 test cases asesmen BNSP.

---

## 🛠️ Cara Menjalankan Aplikasi

1. Install dependensi:
   ```bash
   npm install
   ```

2. Jalankan aplikasi Expo dev server:
   ```bash
   npx expo start
   ```

3. Jalankan di Android Emulator / Perangkat Android:
   ```bash
   npx expo run:android
   ```
