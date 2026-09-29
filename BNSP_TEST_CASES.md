# BNSP TEST CASES — KulinerDekat

Dokumen ini berisi pengujian fungsionalitas dan skenario pengujian (*test cases*) aplikasi mobile **KulinerDekat** untuk asesmen sertifikasi BNSP Junior Mobile Programmer.

---

## Ringkasan Skenario Pengujian

| ID Pengujian | Nama Pengujian | Komponen Diuji | Status |
| :--- | :--- | :--- | :---: |
| **TEST-01** | Application Launch | Routing & Auth Removal | PASSED |
| **TEST-02** | Location Permission Granted | Expo Location & GPS | PASSED |
| **TEST-03** | Location Permission Denied | Graceful Location Fallback | PASSED |
| **TEST-04** | Restaurant Search | Search Filter & State | PASSED |
| **TEST-05** | Restaurant Marker | Interactive Map Marker | PASSED |
| **TEST-06** | Restaurant Detail | SQLite Menus & Reviews Data | PASSED |
| **TEST-07** | Database Persistence | SQLite Idempotent Seed & Storage | PASSED |
| **TEST-08** | External Navigation | Deep Link / Intent Integration | PASSED |
| **TEST-09** | Dynamic GPS Location Update | Haversine Distance Calculation | PASSED |

---

## Detail Skenario Pengujian

### Test 1 — Application Launch
* **Aksi**: Buka aplikasi dari layar utama / launcher perangkat Android.
* **Hasil yang Diharapkan**: Aplikasi terbuka langsung ke halaman utama (**KulinerDekat**) tanpa meminta login, registrasi, atau otentikasi Clerk.
* **Hasil Pengujian**: **PASSED**. Jalur routing langsung menuju `src/app/index.tsx` dan menampilkan judul aplikasi "KulinerDekat".

---

### Test 2 — Location Permission Granted
* **Aksi**: Berikan izin akses lokasi (*Foreground Location Permission*) saat dialog izin muncul.
* **Hasil yang Diharapkan**: Posisi GPS pengguna terbaca melalui `expo-location`, peta berpusat pada posisi pengguna, dan marker lokasi pengguna ditampilkan.
* **Hasil Pengujian**: **PASSED**. Koordinat lat/lng pengguna terbaca, alamat hasil *reverse geocoding* ditampilkan, dan marker biru lokasi aktif muncul pada peta.

---

### Test 3 — Location Permission Denied
* **Aksi**: Tolak izin akses lokasi saat dialog izin muncul.
* **Hasil yang Diharapkan**: Aplikasi **tidak crash**, menampilkan pesan peringatan pengguna yang informatif, dan tetap berfungsi penuh menggunakan koordinat default Palembang (-2.9761, 104.7754).
* **Hasil Pengujian**: **PASSED**. Banner peringatan `⚠️ Izin lokasi belum diberikan...` muncul di bagian atas, dan daftar kuliner lokal tetap dapat diakses dengan stabil.

---

### Test 4 — Restaurant Search
* **Aksi**: Ketik kata kunci `"pempek"` pada bidang pencarian (*SearchBar*).
* **Hasil yang Diharapkan**: Daftar restoran dan marker pada peta langsung menyaring data yang sesuai (misalnya *Pempek Selamat* dan *Pempek Noni*).
* **Hasil Pengujian**: **PASSED**. Hanya tempat kuliner dengan nama, kategori, atau alamat yang memuat kata kunci "pempek" yang ditampilkan.

---

### Test 5 — Restaurant Marker
* **Aksi**: Ketuk salah satu marker kuliner (ikon 🍴) pada peta.
* **Hasil yang Diharapkan**: Marker berubah warna menjadi *active state* dan nama restoran serta kategorinya muncul pada callout / navigasi tempat dapat dibuka.
* **Hasil Pengujian**: **PASSED**. Marker merespon ketukan pengguna dan memungkinkan pengguna membuka detail tempat kuliner terkait.

---

### Test 6 — Restaurant Detail
* **Aksi**: Pilih salah satu tempat kuliner dari daftar atau peta untuk membuka halaman detail (`src/app/place/[id].tsx`).
* **Hasil yang Diharapkan**: Halaman detail menampilkan nama restoran, alamat, rating, kategori, jarak, peta lokasi mini, daftar menu (diambil dari tabel `menus` SQLite), dan ulasan pengunjung (diambil dari tabel `reviews` SQLite).
* **Hasil Pengujian**: **PASSED**. Data menu dan ulasan terambil secara relasional melalui foreign key `place_id` dari SQLite local database.

---

### Test 7 — Persistence
* **Aksi**: Tutup aplikasi sepenuhnya (*force close*), lalu buka kembali aplikasi.
* **Hasil yang Diharapkan**: Data tempat kuliner, menu, dan ulasan di SQLite tetap tersimpan, dan proses inisialisasi *seed database* bersifat idempotensial (tidak menghasilkan data duplikat).
* **Hasil Pengujian**: **PASSED**. Pengecekan `SELECT COUNT(*)` mencegah duplikasi data seed saat aplikasi dinyalakan kembali.

---

### Test 8 — Navigation
* **Aksi**: Tekan tombol **"Buka Navigasi (Google Maps)"** pada halaman detail kuliner.
* **Hasil yang Diharapkan**: Aplikasi eksternal Google Maps terbuka dengan titik tujuan (*destination*) berupa koordinat lat/lng restoran yang dipilih dan titik awal berupa posisi GPS pengguna.
* **Hasil Pengujian**: **PASSED**. Deep link Google Maps URL scheme (`https://www.google.com/maps/dir/?api=1...`) atau intent Android `geo:` terbuka dengan mulus.

---

### Test 9 — Different User Locations
* **Aksi**: Ubah lokasi simulasi GPS pada emulator Android (misalnya ke area Bukit Besar atau Demang Lebar Daun).
* **Hasil yang Diharapkan**: Posisi pengguna di peta diperbarui dan nilai jarak relatif ("... km dari lokasi Anda") terhitung ulang secara dinamis menggunakan rumus Haversine.
* **Hasil Pengujian**: **PASSED**. Penghitungan jarak Haversine memperbarui nilai km secara akurat sesuai perubahan koordinat GPS.
