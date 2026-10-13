# 🎬 PANDUAN OPERASIONAL SISTEM LANDING PAGE & ROADSHOW "PIYE TO KIH?"
**Miracle Pictures Internal Guide v1.0**

Sistem ini dirancang khusus untuk mendukung kampanye distribusi film nasional **"PIYE TO KIH?"** (@piyetokihfilm.official), memisahkan funnel **War Voucher Nasional (Lead Capture & Hype)** dan **Landing Page 17 Kota (Konversi Tiket Bioskop Lokal)**.

---

## 🚀 1. Akses Halaman & Fitur Utama

| URL Jalur | Fungsi & Tampilan | Target Aksi Pengunjung |
| :--- | :--- | :--- |
| **`http://localhost:3000/`** atau **`piyetokihfilm.com`** | **Mainpage War Voucher Rp 10.000 Nasional**<br>• Hero trailer & sinopsis<br>• Banner promo Buy 1 Get 1<br>• Countdown Timer & Kuota Bar<br>• Form War Voucher (Nama, WA, Email, Kota)<br>• Modal e-voucher ber-barcode & stempel resmi | Mengisi form untuk klaim voucher Rp 10.000 (Event Meta Pixel: `Lead`) |
| **`http://localhost:3000/bogo`** atau **`piyetokihfilm.com/bogo`** | **Landing Page Dedicated Promo BUY 1 GET 1**<br>• Visual nonton berdua film Piye To Kih<br>• Tombol direct CTA Beli Tiket B1G1<br>• Pilihan bioskop mitra (XXI, CGV, Cinépolis, TIX ID) | Klik langsung beli tiket promo B1G1 (Event Meta Pixel: `TicketIntent`) |
| **`http://localhost:3000/city/[slug]`** atau **`[kota].piyetokihfilm.com`** | **Halaman Roadshow Per Kota**<br>• Jadwal bioskop & mall spesifik<br>• Kapasitas studio & jam tayang<br>• **Hanya Button Beli Tiket** (Direct CTA ke XXI, CGV, Cinepolis, Platinum, NSC) | Klik langsung beli tiket bioskop (Event Meta Pixel: `TicketIntent`) |
| **`http://localhost:3000/voucher/[serialNumber]`** | **Halaman Publik Tiket Peserta**<br>• Tampilan tiket digital resmi Rp 10.000<br>• Nomor seri unik & stempel terverifikasi<br>• Tombol download file PDF tiket | Cukup ditunjukkan di HP saat di kasir bioskop & bayar Rp 10.000 |
| **`http://localhost:3000/admin`** | **Pusat Kontrol / Admin Dashboard**<br>• Rekap Database Leads (Filter kota dinamis)<br>• Kontrol kuota & countdown timer<br>• Kontrol Promo Buy 1 Get 1 (Link XXI, CGV, Cinépolis, TIX ID)<br>• Pengaturan Email Gateway (SMTP Delivery & Testing)<br>• Editor link tiket 17 kota & Wahnotif AI Persona | Tim Marketing & Promotor Miracle Pictures |

---

## 📍 2. Daftar 17 Kota Roadshow (22 Oktober - 8 November 2026)

Setiap kota memiliki halaman khusus yang siap dijadikan tujuan iklan Meta Ads:

1. **Semarang** (`/city/semarang`): The Park XXI & Cinépolis Java Mall
2. **Yogyakarta** (`/city/jogja`): Plaza Ambarrukmo XXI & Jogja City Mall XXI
3. **Magelang** (`/city/magelang`): Platinum Cineplex Artos Mall & The Aloon-Aloon XXI
4. **Surakarta / Solo** (`/city/solo`): Solo Paragon XXI & Platinum Solo Baru
5. **Sragen** (`/city/sragen`): Platinum Plaza Atrium Sragen
6. **Ngawi** (`/city/ngawi`): New Star Cineplex (NSC) Ngawi
7. **Madiun** (`/city/madiun`): CGV Plaza Lawu & Suncity Madiun XXI
8. **Ponorogo** (`/city/ponorogo`): Cinépolis Ponorogo City Center
9. **Nganjuk** (`/city/nganjuk`): Sam's Studio Nganjuk
10. **Mojokerto** (`/city/mojokerto`): CGV Sunrise Mall Mojokerto
11. **Gresik** (`/city/gresik`): Gressmall XXI Gresik
12. **Surabaya** (`/city/surabaya`): Royal Plaza XXI Surabaya
13. **Sidoarjo** (`/city/sidoarjo`): Platinum Suncity Mall & Ciplaz Sidoarjo XXI
14. **Malang** (`/city/malang`): Dieng XXI & Cinépolis Malang Town Square
15. **Kediri** (`/city/kediri`): Ciplaz Kediri XXI
16. **Blitar** (`/city/blitar`): CGV Blitar Square
17. **Tulungagung** (`/city/tulungagung`): Golden Theatre Tulungagung

---

## 🤖 3. Integrasi Wahnotif & AI Persona "Kang Kih"

### A. Pengiriman Pesan Otomatis (Outbound)
Ketika user submit formulir War Voucher di web utama, sistem otomatis mengirimkan WhatsApp ke nomor peserta berisi ucapan selamat, nomor seri, dan tautan PDF voucher resmi.
* Atur API Key di menu: **Admin Dashboard ➔ Tab Wahnotif & AI Persona**.

### B. Inbound Webhook (Ads Click-to-WA)
Untuk iklan Meta Ads yang diarahkan ke WhatsApp bisnis Anda:
* Pasang URL Webhook berikut di dashboard Wahnotif:
  ```
  https://domain-anda.com/api/webhook/wahnotif
  ```
* Setiap kali user yang chat via WA melengkapi data diri dengan AI, Wahnotif akan menembak webhook ini dan data otomatis tercatat di dashboard web!

### C. System Prompt AI "Kang Kih" (Tinggal Salin ke Wahnotif AI)
Prompt karakter sudah tersedia dan bisa langsung disalin dengan 1 klik di Admin Dashboard:
* **Gaya Bicara**: Santai, akrab, sedikit medok khas Jawa-Indonesia, hangat, dan menghibur.
* **Misi**: Menjawab jadwal bioskop 17 kota dan mengumpulkan data pendaftar voucher nonton.

---

## 📊 4. Meta Pixel & Tracking Ads
Pixel sudah dipasang secara dinamis di seluruh sistem:
* **`PageView`**: Terkirim otomatis di setiap halaman.
* **`Lead`**: Terkirim saat penonton berhasil mengklaim voucher di Mainpage.
* **`TicketIntent`**: Terkirim saat penonton mengklik tombol "BELI TIKET BIOSKOP" di halaman kota, membawa parameter:
  ```json
  {
    "city": "Surakarta (Solo)",
    "cinema": "Solo Paragon XXI",
    "destination_url": "https://m.21cineplex.com"
  }
  ```
* ID Pixel bisa diganti sewaktu-waktu di **Admin Dashboard ➔ Tab Pengaturan**.

---

## 📧 6. Pengaturan Email Gateway (SMTP Delivery)

Voucher digital resmi sekarang otomatis dikirimkan ke alamat email penonton segera setelah formulir disubmit:
* **Menu Akses**: **Admin Dashboard ➔ Pengaturan Email Gateway** (Sidebar menu).
* **Konfigurasi SMTP**:
  * **Hostinger Email**: Host `smtp.hostinger.com`, Port `465` (SSL), User: `ticket@piyetokihfilm.com`.
  * **Gmail SMTP**: Host `smtp.gmail.com`, Port `465` (SSL), Password menggunakan *Google App Password*.
* **Fitur Uji Coba (Live Test Email)**: Terdapat tombol "Kirim Email Tes" di dashboard untuk memverifikasi kelancaran koneksi email sebelum kampanye dimulai.
* **Mode Auto-Mock**: Jika SMTP belum diisi, sistem otomatis mencatat simulasi sukses di log tanpa membuat pendaftaran penonton error.

---

## 🎟️ 7. Masa Berlaku Voucher Penayangan Perdana di Bioskop

Berdasarkan Operating Handbook, penayangan perdana film *"PIYE TO KIH?"* dimulai serentak secara nasional pada **19 November 2026**.
* Voucher War ini **hanya dapat digunakan/ditukarkan di loket kasir bioskop mitra pada periode penayangan perdana**.
* **Fleksibilitas Setting di Dashboard**:
  * Akses: **Admin Dashboard ➔ Pengaturan Voucher & Tayang ➔ Bagian 5**.
  * Dilengkapi tombol preset cepat:
    * `19 - 20 November 2026 (Penayangan Perdana)` (Default handbook - Penayangan Perdana)
    * `19 - 25 November 2026 (Minggu Pertama Tayang)`
    * `19 November - 02 Desember 2026 (2 Pekan Penayangan)`
  * Pengaturan tanggal ini secara otomatis tercetak pada:
    1. Kartu E-Voucher digital di website.
    2. Unduhan PDF tiket penonton.
    3. Template pesan WhatsApp Wahnotif (AI Assistant).
    4. Isi HTML email konfirmasi yang diterima penonton.

---

## 🎟️ 8. Pengaturan Halaman Promo Buy 1 Get 1 (BOGO)

Sesuai funnel iklan nonton berdua / pasangan, sistem menyediakan landing page khusus **`/bogo`** yang berfungsi mirip halaman roadshow:
* **Fungsi Utama**: Calon penonton tidak mengisi form, melainkan langsung diarahkan ke tautan pembelian tiket bioskop mitra resmi (m.tix XXI, CGV, Cinépolis, TIX ID).
* **Tracking Meta Pixel**: Setiap klik pada tombol tiket memicu event Meta Pixel `TicketIntent` dengan parameter mitra bioskop dan promo BOGO.
* **Kontrol Fleksibel di Admin Dashboard**:
  * Akses: **Admin Dashboard ➔ Menu Promo Buy 1 Get 1 (BOGO)** di sidebar.
  * Anda dapat mengubah:
    1. **Status Buka/Tutup**: Saklar aktif/nonaktif promo BOGO.
    2. **Link Tiket Utama**: URL tombol banner besar.
    3. **Link Tiket Spesifik**: URL per bioskop (Cinema XXI, CGV, Cinépolis, TIX ID).
    4. **Subjudul Penawaran**: Teks ajakan nonton berdua.
* **Cross-Promotion di Mainpage**: Terdapat banner kecil elegan di bagian atas beranda utama (`/`) yang menghubungkan penonton yang ingin nonton berdua langsung ke `/bogo`.

---

## ⚙️ 9. Cara Menjalankan Aplikasi
* **Menjalankan Local Development:**
  ```bash
  npm run dev
  ```
* **Build & Start Production:**
  ```bash
  npm run build
  npm run start
  ```
* **Wildcard Subdomain Setup di DNS (Cloudflare / Hosting):**
  Tambahkan CNAME atau A Record:
  * Name: `*` (asterisk)
  * Target: IP Server / VPS Anda
  * Dengan ini, semua subdomain (`solo.domain.com`, `jogja.domain.com`, dst) langsung aktif tanpa perlu setting manual satu per satu!

