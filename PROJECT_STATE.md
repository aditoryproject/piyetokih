# 🔒 PROJECT STATE & VPS ISOLATION RULES (PIYE TO KIH?)
> **WAJIB DIBACA SETIAP KALI UPDATE PROYEK INI DILAKUKAN**
> File ini merangkum status proyek, riwayat pembaruan, dan aturan penguncian isolasi VPS agar **HEMAT TOKEN** (tidak perlu membaca ulang seluruh codebase) dan **TIDAK PERNAH MENYENGGOL PROYEK LAIN DI VPS**.

---

## ⛔ ATURAN MUTLAK ISOLASI VPS (JANGAN PERNAH DILANGGAR)
Server VPS: `187.127.218.82` (Hostinger / CloudPanel).

Server ini menampung **5 website aktif sekaligus**. Saat mengerjakan proyek **Miracleweb (Piye To Kih)**:
1. **HANYA BOLEH MENYENTUH**:
   * Folder: `/home/piyetokihfilm/htdocs/piyetokihfilm.com`
   * Port: **`3005`**
   * Service PM2: **`piyetokih-web`**
2. **DILARANG KERAS**:
   * ❌ Mematikan/kill port global (`fuser -k`, `killall node`, dsb).
   * ❌ Menjalankan `pm2 kill`, `pm2 restart all`, atau `pm2 delete all`.
   * ❌ Mengubah file konfigurasi nginx proyek lain di `/etc/nginx/sites-enabled/`.
   * ❌ Mengakses tool MCP Hostinger / browser eksternal tanpa izin eksplisit user.
3. **PETA PORT VPS RESMI (DAFTAR TERKUNCI)**:
   | Port | Nama Proyek | Service PM2 | Domain |
   | :--- | :--- | :--- | :--- |
   | **3005** | **Miracleweb (Piye To Kih)** | **`piyetokih-web`** | **`piyetokihfilm.com`** |
   | 3000 | AdSight Platform | `adsight` | `adsight.id` |
   | 3001 | Playlist Live Festival | `playlistweb` | `playlistlivefestival.letsplaymaker.com` |
   | 3100 | TaskManager / Kanban | `taskmanager` | `kanban.bigdonte.com` |
   | 5002 | SocialEdge Backend | `socialedge-backend` | `socialedge.id` |

---

## 🚀 PROSEDUR STANDAR DEPLOY KE VPS
Push ke GitHub **TIDAK OTOMATIS** mendeploy ke VPS. Jalankan perintah khusus isolasi ini:
```bash
ssh root@187.127.218.82 "cd /home/piyetokihfilm/htdocs/piyetokihfilm.com && git pull origin main && npm run build && pm2 reload piyetokih-web"
```
*(Hanya reload `piyetokih-web`, jangan reload service lain!)*

---

## 🗺️ PETA ARSITEKTUR CEPAT (HEMAT TOKEN)
Tidak perlu membaca seluruh file source code, cukup rujuk file berikut sesuai kebutuhan:
* **Halaman Publik Media Kit / Press Center**: [`src/app/media/page.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/media/page.tsx)
* **Panel Kontrol Admin (Tab Media Center, Leads, dll.)**: [`src/components/AdminDashboardClient.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/AdminDashboardClient.tsx)
* **Penyimpanan Database Persisten**: [`data/db.json`](file:///Users/maulanaadipriatna/Documents/Miracleweb/data/db.json) & [`data/db.persist.json`](file:///Users/maulanaadipriatna/Documents/Miracleweb/data/db.persist.json)
* **Sistem Proteksi Database**: [`src/lib/db.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/db.ts) (Multi-layer fallback & external persist file).
* **Integrasi WhatsApp & AI Bot**: [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts) (Persona resmi: **Mas Kidi**).
* **Otak Pengetahuan & Fakta Bot**: [`src/lib/bot-knowledge.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/bot-knowledge.ts) (Knowledge Base lengkap dari 2 dokumen docx).
* **Koleksi Endpoint Webhook Wahnotif**:
  - Master Webhook All-In-One: `/api/webhook/wahnotif`
  - Webhook Jadwal & Roster Roadshow: `/api/webhook/roadshow`
  - Webhook Link Tiket, Presale & BOGO: `/api/webhook/tickets`
  - Webhook Info Film, Cast & Soundtrack: `/api/webhook/movie-info`
  - Webhook Klaim Voucher & Leads: `/api/webhook/voucher`
  - Webhook Otak AI & Knowledge Base: `/api/webhook/ai-brain`
* **Data Kota & Bioskop Roadshow (17 Kota)**: [`src/lib/cities.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts)

---

## 📋 RANGKUMAN UPDATE SEBELUMNYA (CHANGELOG)
1. **Revisi Media Kit Sesuai PDF (`Revisi Media kit.pdf`)**:
   * **Tombol CTA Kuning Amber**: Semua tombol unduh di `/media` menggunakan styling konsisten (`bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black`).
   * **Take-out Kotak Detail**:
     * Box bullet nama file stills (`• PTK_STILL_01_MUKIDI_SUKMA.jpg`, dll.) **telah dihapus**.
     * Box bullet nama cast (`• Heri Chandra – Mukidi`, dll.) **telah dihapus**.
     * Box spesifikasi fact sheet dan press release telah disederhanakan menjadi tombol direct download.
   * **Bagian yang Dipertahankan**: Multimedia Video Assets (First Look, Teaser, Main Trailer) & Brand Logo (PTK PNG, Miracle PNG, Logo Pack ZIP) tetap ada dengan link unduh masing-masing.
2. **Pembersihan Panel Admin (`/admin`)**:
   * Menghilangkan badge teks aneh seperti `TOMBOL CTA KUNING: ...` pada seluruh form Kontainer 01 - 06.
   * Form dipecah dengan placeholder spesifik untuk tiap item unduhan (Teaser Poster, Main Poster, ZIP Stills, PDF Fact Sheet, BTS, Foto Cast, Logo, Trailer, Filter Sosmed).
3. **AI Persona "Mas Kidi"**:
   * Nama bot distandarisasi menjadi **Mas Kidi** (menggantikan Kang Kih) dengan gaya bicara medok santai khas Woko Channel.
   * Filter tanggal roadshow otomatis: mengarahkan penonton kota expired ke promo BOGO penayangan serentak 19 November 2026.
4. **Perbaikan Port VPS & Pemulihan Sistem Multi-Site**:
   * Menghapus duplikasi port 3000 dari backend socialedge sehingga AdSight (`adsight.id`) pulih normal.
   * Menghidupkan daemon PM2 untuk `taskmanager` (port 3100) dan `playlistweb` (port 3001).
   * Menetapkan konfigurasi PM2 persisten (`pm2 save`).
5. **Upgrade Total Webhook CS AI Wahnotif (Multi-Webhook Endpoints & Embedding 2 Dokumen Docx)**:
   * **Embedding 2 Dokumen Resmi**:
     - `PIYE_TO_KIH_Wahnotif_AI_Bot_Training_Knowledge_Base_v1_0.docx`: Master facts, sinopsis resmi, arti judul "Piye To Kih?", pantun jenaka, jokes tongkrongan khas WOKO, spoiler guardrails, complaint & media escalation, serta FAQ Answer Bank lengkap.
     - `PIYE_TO_KIH_Roadshow_Flyer_Template_Scripts_v1_1_Mukidi_Dara.docx`: Rundown jadwal 18 stops / 17 kota lengkap dengan jam, sekolah, kampus, radio, meet & greet mall, bioskop greeting / nonton duluan, lead speaker (Mukidi + Dara Sarasvati / Trio WOKO), serta roster aktual pemain yang hadir di tiap kota.
   * **Pemisahan Jadi Multi-Webhook Endpoints (Tidak Lagi Hanya 1 Webhook)**:
     - 📍 `/api/webhook/roadshow`: Khusus jadwal per kota, jam acara, status aktif/expired, dan roster pemain.
     - 🎟️ `/api/webhook/tickets`: Khusus link cepat pembelian tiket resmi bioskop (Cinema XXI/M-TIX, TIX ID, CGV, Cinepolis) serta kuota promo Buy 1 Get 1 (1.000 TIX ID, 500 M-TIX).
     - 🎬 `/api/webhook/movie-info`: Khusus sinopsis, profil 13 cast pemain, 4 OST Lek Dahlan (+ tautan klip YouTube), dan 25 bioskop mitra (menegaskan Movieplex UNCONFIRMED).
     - 🎁 `/api/webhook/voucher`: Khusus penerbitan Kode Booking voucher fisik Rp10.000 booth mall atau pengalihan otomatis ke Pengingat BOGO untuk kota expired.
     - 🧠 `/api/webhook/ai-brain`: Khusus Knowledge Base lengkap dalam format JSON yang dapat ditarik langsung oleh bot.
     - ⚡ `/api/webhook/wahnotif`: Master Multi-Tools Dispatcher yang otomatis mengenali intent pesan user.
   * **Update Panel Admin (`/admin`)**:
     - Tab "Wahnotif & Webhook" kini menyediakan daftar 5 Webhook Khusus + 1 Master Webhook lengkap dengan tombol 1-klik untuk Salin URL Webhook dan Salin Skema Tool JSON.
6. **Implementasi Konversi Presale & Nonton Duluan (Special Screening) + Sinkronisasi Dinamis Wahnotif**:
   * **Intent Presale & Nonton Duluan**: `/api/webhook/tickets` dan `/api/webhook/wahnotif` otomatis mengenali kata kunci *nonton duluan*, *presale*, *spesial screening*, *screening*, *nonton awal*. Respon bot langsung memicu konversi tinggi: mengajak nonton lebih awal bareng pemain sebelum penayangan nasional 19 Nov, menegaskan kuota kursi terbatas per studio, dan menyodorkan link presale resmi (XXI M-TIX, TIX ID, CGV, Cinepolis).
   * **Timeline Promo Buy 1 Get 1 (BOGO)**:
     - **Sebelum 15 November 2026**: Mengarahkan calon penonton mengamankan slot Pengingat Prioritas H-1 via WA (Nama Lengkap & Kota) agar kuota 1.000 tiket TIX ID dan 500 tiket M-TIX tidak terlewat, sembari menawarkan opsi presale nonton duluan jika ingin nonton lebih awal.
     - **Mulai 15 November 2026 ke atas**: Langsung mengirimkan link aktif loket promo BOGO TIX ID & M-TIX XXI untuk war tiket langsung.
   * **Generator Persona Dinamis (`getWahnotifPersona`)**:
     - `src/lib/wahnotif.ts`, `/api/wahnotif/persona`, dan `/api/webhook/ai-brain` kini menginterpolasi link tiket dari database secara dinamis.
     - Panel Admin (`/admin` tab Wahnotif) kini merefleksikan link presale terbaru yang diisi admin secara real-time pada 4 kolom isian dan Master Prompt.

7. **Floating WhatsApp Widget (Mas Kidi - Official WA Piye To Kih) Mobile-Responsive**:
   * **Komponen Baru**: [`src/components/FloatingWhatsAppWidget.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/FloatingWhatsAppWidget.tsx) dimuat global di [`src/app/layout.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/layout.tsx).
   * **Branding Natural & Human (Non-AI)**: Seluruh label "Official AI" dan "AI CS" diganti menjadi **"Official WA Piye To Kih"** dan **"Official WA"** agar terasa natural, resmi, dan ramah seperti CS WhatsApp resmi film.
   * **Desain & Responsivitas Mobile Anti-Terhalang**:
     - Posisi adaptif safe-area insets (`env(safe-area-inset-bottom)`, `env(safe-area-inset-right)`) mencegah tabrakan dengan home bar iOS / toolbar browser mobile.
     - Di mobile (< 640px), modal popover menggunakan `inset-x-3` (terpusat presisi tanpa terpotong sisi kiri/kanan), `max-h-[calc(100dvh-2.5rem)]` adaptif terhadap keyboard & address bar, serta scroll locking body.
     - Pilihan cepat menggunakan anchor link native (`<a>`) untuk menghindari blokir popup pada iOS Safari dan Chrome Android.
   * **4 Pilihan Cepat Khas Mas Kidi**:
     1. Tiket Presale & Nonton Duluan (konversi tinggi sebelum 19 Nov).
     2. Jadwal Roadshow & Temu Pemain (auto-detect kota jika sedang membuka `/city/[slug]`).
     3. Info Promo Buy 1 Get 1 (amankan slot reminder kuota 1.000 TIX ID & 500 M-TIX).
     4. Tanya Bebas / Ngobrol Mas Kidi (jokes santai, pemain, sinopsis).
   * **Tracking Analytics**: Dilengkapi pelacakan Meta Pixel event `Contact` untuk setiap klik opsi atau pengiriman pertanyaan custom.

8. **Update Greeting Sticky Floating WhatsApp Widget**:
   * Teks sapaan pembuka pada popup chat [`src/components/FloatingWhatsAppWidget.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/FloatingWhatsAppWidget.tsx) diperbarui dari `Halo bolo asik! Piye kabare? 😄` menjadi `Halo, Dulur! Piye kabare?☺️` sesuai permintaan.

9. **Revisi Alur Penukaran E-Voucher: Isolasi ke Booth Roadshow Meet & Greet Offline (Steril dari Nama Bioskop)**:
   * **Latar Belakang & Masalah**: Pihak bioskop (XXI, Cinepolis, CGV, dll.) melarang keras transaksi/penukaran e-voucher di area dan kasir bioskop. Sebelumnya, kartu voucher menampilkan nama bioskop (misal: `The Park XXI Semarang - Cinepolis Java Mall Semarang` atau `Solo Paragon XXI • Platinum Cineplex Pakuwon Mall Solo Baru`) yang memicu salah paham penonton datang ke kasir bioskop.
   * **Implementasi Fungsi Pembersih Nama Tempat (`cleanVenueToMallName`)**:
     - Ditambahkan helper `cleanVenueToMallName` di [`src/lib/cities.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts) yang otomatis membersihkan seluruh kata brand bioskop (`XXI`, `Cinema XXI`, `Cinépolis`, `Cinepolis`, `CGV`, `Platinum Cineplex`, `Platinum`, `NSC`, `New Star Cineplex`, `Cinema`, `Bioskop`) menjadi nama mall/tempat saja (contoh: `The Park Mall Semarang - Java Mall Semarang`, `Solo Paragon Mall • Pakuwon Mall Solo Baru`).
   * **Update Kartu E-Voucher & PDF ([`src/components/VoucherTicketCard.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/VoucherTicketCard.tsx))**:
     - Menghapus label `(MALL & BIOSKOP)`.
     - Mengubah header menjadi `LOKASI PENUKARAN: BOOTH ACARA ROADSHOW (BUKAN BIOSKOP)`.
     - Menyajikan detail lengkap: Titik Booth, Area/Lantai Booth, Jam Acara Meet & Greet, Petunjuk Arah, dan Daftar Mall Acara di kota tersebut (steril dari kata bioskop).
     - Menambahkan banner peringatan tegas: `⛔ DILARANG MENUKAR DI AREA BIOSKOP: Penukaran HANYA dilayani di konter booth roadshow Meet & Greet offline. Kasir bioskop DILARANG & TIDAK MELAYANI penukaran kode booking.`
     - Menambahkan tautan langsung melihat jadwal roadshow lengkap di website.
   * **Update Saluran WhatsApp & Webhook**:
     - [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts), `/api/webhook/voucher`, `/api/webhook/wahnotif`, dan `/api/webhook/roadshow`:
     - Menegaskan bahwa di WA tidak terdapat dropdown pilihan titik seperti di website, sehingga bot Mas Kidi dan pesan balasan langsung mengarahkan ke konter booth resmi acara Roadshow Meet & Greet offline di kotanya serta memberikan link jadwal lengkap website (`piyetokihfilm.com/roadshow` atau `/city/{slug}`).
     - Memberikan peringatan keras bahwa kasir bioskop tidak melayani penukaran e-voucher kode booking. Lembaran voucher fisik resmi yang sudah diambil di booth baru digunakan saat nonton di bioskop tanggal 19–20 November 2026.
   * **Update Halaman & Komponen Pendukung**:
     - [`/voucher/[id]`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/voucher/[id]/page.tsx), [`src/components/WarVoucherForm.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/WarVoucherForm.tsx), [`src/components/CityVoucherPickupSection.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/CityVoucherPickupSection.tsx), [`src/app/city/[slug]/page.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/city/[slug]/page.tsx), dan template email [`src/lib/email.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/email.ts) diselaraskan secara konsisten.
   * **Auto-Migrasi & Sanitasi Data Leads Lama (Tanpa Perlu Daftar Ulang)**:
     - Di [`src/lib/db.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/db.ts) ditambahkan auto-sanitasi pada `ensureDb()`: seluruh leads lama yang tersimpan di `db.json` / `db.persist.json` yang masih memuat nama brand bioskop otomatis dibersihkan menjadi nama mall/tempat acara roadshow secara permanen.
     - Di [`src/components/AdminDashboardClient.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/AdminDashboardClient.tsx), tampilan tabel leads dan export CSV otomatis menampilkan nama mall bersih.
     - User/penonton lama yang membuka link e-voucher kode bookingnya ([`/voucher/[id]`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/voucher/[id]/page.tsx)) otomatis melihat tampilan booth roadshow dan nama mall yang baru tanpa perlu mengisi formulir pendaftaran baru.

10. **Update Jadwal Tayang Cinépolis Java Mall Semarang (18.00 -> 19.00 WIB)**:
    * **Jadwal Screening & Tiket**: Mengubah jam tayang Special Screening Nonton Duluan di Cinépolis Java Mall Semarang dari 18.00 WIB menjadi **19.00 WIB** (pintu dibuka 15 menit sebelumnya pada 18.45 WIB) di [`src/lib/cities.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts).
    * **Rundown Acara & Bot AI / WhatsApp**: Memperbarui informasi jadwal roadshow Semarang di [`src/lib/bot-knowledge.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/bot-knowledge.ts) dan [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts) menjadi `19.00 - 20.40 WIB: Nonton Duluan di Java Mall Cinepolis`.

11. **Update Jadwal Special Screening XXI 5 Kota Sesuai Rilis Resmi**:
    * **Semarang**: The Park XXI berubah menjadi **14.30 WIB** (sebelumnya 15.30).
    * **Yogyakarta**: Plaza Ambarrukmo XXI berubah menjadi **14.30 WIB** (sebelumnya 15.45) dan Jogja City XXI berubah menjadi **16.30 WIB** (sebelumnya 18.30).
    * **Magelang**: The Aloon-Aloon XXI berubah menjadi **16.45 WIB** (sebelumnya 18.00).
    * **Solo**: Solo Paragon XXI berubah menjadi **12.15 WIB** (sebelumnya 13.15).
    * **Madiun**: Suncity Madiun XXI berubah menjadi **19.00 WIB** (sebelumnya 18.45).
    * Ter-update pada [`src/lib/cities.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts), [`src/lib/bot-knowledge.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/bot-knowledge.ts), dan [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts).

12. **Standarisasi Sapaan & Eskalasi Human Handover Wahnotif (Anti Ayah/Bunda)**:
    * **Penyebab Sapaan Ayah/Bunda**: Sebutan tersebut merupakan default template bawaan sistem chatbot Wahnotif saat memicu pesan fallback/eskalasi CS manusia.
    * **Aturan Mutlak Persona & Webhook**:
      - Menambahkan larangan mutlak sebutan Ayah/Bunda pada [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts) dan mewajibkan panggilan khas Piye To Kih: *Lur / Bolo Asik / Dulur*.
      - Menambahkan router eskalasi manusia otomatis di [`/api/webhook/wahnotif`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts) dan [`/api/webhook/ai-brain`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/ai-brain/route.ts) dengan teks khas Mas Kidi: *"Siap bolo asik! Mas Kidi sambungkan langsung ke Tim Admin Miracle Pictures ya lur. Tunggu sebentar nggih, admin kami bakal segera balas chat sampean di sini! 🍿✨"*.

13. **Sinkronisasi Link Tiket Dinamis, Upsell Presale Roadshow #1 & Mesin Follow-Up WA Hardsell**:
    * **Sinkronisasi Otomatis Link Tiket Terkini**:
      - Ditambahkan helper [`getCityCinemaTicketLinks`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts) yang mengaitkan link bioskop kota ke seluruh endpoint webhook CS Wahnotif (`/api/webhook/tickets`, `/api/webhook/wahnotif`, `/api/webhook/roadshow`).
      - Setiap kali link diperbarui (baik via Admin Dashboard pada `bogoCinemaLinks` / `cityLinkOverrides`, maupun via kode `cities.ts`), CS AI WhatsApp secara otomatis dan langsung memberikan link tiket yang paling baru secara real-time tanpa perlu konfigurasi ulang.
    * **Upsell Presale Roadshow (Nonton Duluan) Sebagai Prioritas #1**:
      - Setiap penonton yang menanyakan tiket, promo BOGO 19 Nov, jadwal, harga, atau voucher booth offline: bot Mas Kidi dan webhook wajib meng-upsell sesi **Presale Nonton Duluan (Special Screening) Roadshow** terlebih dahulu sebelum penayangan reguler.
      - Menekankan benefit nonton bareng rombongan cast (Mukidi, Sukma, Gendut, Penyok) di dalam studio bioskop sebelum penayangan reguler, disertai urgensi kelangkaan kuota kursi.
      - Diselipkan langsung pada pesan konfirmasi WhatsApp saat penonton mendaftar booking voucher roadshow maupun antrean reminder promo BOGO.
    * **Persona Mas Kidi Hardselling & FOMO Urgency**:
      - Dilengkapi gaya penutup mendesak (FOMO): *"Mukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae nunda-nunda? Klik saiki lur!"*, dorongan kursi tengah cepat ludes, dan pertanyaan penutup yang menuntut aksi (closing question).
    * **Mesin Follow-Up WhatsApp Presale Roadshow (Drip / Cron)**:
      - Dibuat endpoint baru [`/api/cron/presale-followup`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/cron/presale-followup/route.ts) yang dapat dipanggil via Cron Job berkala atau di-trigger langsung dari panel Admin Dashboard.
14. **Pusat Kendali Pengaturan Jadwal Roadshow & Bioskop 17 Kota di Panel Admin**:
    * **Latar Belakang & Kebutuhan**:
      - Jadwal roadshow (jam tayang, bioskop, sisa kursi, alamat, link tiket, booth mall, rundown) sering mengalami penyesuaian dari pihak bioskop/mall di lapangan.
      - Sebelumnya hanya link tiket bioskop yang dapat diubah di panel admin; sekarang telah ditingkatkan menjadi **Pusat Kendali Lengkap** di mana admin dapat mengedit seluruh detail jadwal 17 kota kapan saja secara real-time.
    * **Fitur Utama di Admin Dashboard (`/admin/dashboard` - Tab "Jadwal Roadshow 17 Kota")**:
      - **City Selector (17 Kota)**: Tombol pemilih kota responsif dengan filter pencarian instan, indikator kustomisasi, dan status jadwal.
      - **Tanggal Pelaksanaan (`dateStr`)**: Dapat diedit langsung per kota (misal: "22 Oktober 2026").
      - **Manajemen Bioskop & Special Screening (Sesuai Kartu Nonton Duluan)**:
        - Edit Nama Bioskop (misal: *THE PARK XXI SEMARANG*).
        - Pilih Jaringan Bioskop / Chain (*XXI, Cinépolis, CGV, Platinum, NSC, Indie*).
        - Edit Studio / Audi (misal: *Studio 1 Premiere Sound*).
        - Edit Jam Tayang / Showtimes (misal: *14.30 WIB* atau multiple time dipisah koma).
        - Edit Catatan Pintu Teater (misal: *Pintu teater dibuka 15 mnt sebelumnya*).
        - Edit Teks Sisa Kursi / Urgensi (misal: *±42 kursi tersisa*, *Hampir Habis*).
        - Edit Alamat Lengkap / Mall (misal: *The Park Mall Semarang Lt. 3, Jl. Madukoro Raya No. 1*).
        - Edit Link Tiket Langsung (dengan tombol *Test Link Tiket*).
        - Tombol `+ Tambah Bioskop di Kota Ini` dan `Hapus Bioskop`.
      - **Interactive Live Preview**:
        - Menampilkan kartu gelap preview identik 100% dengan tampilan di halaman publik `/city/[slug]` (sesuai screenshot user), lengkap dengan badge, studio, tanggal, jam tayang, alamat, dan tombol CTA amber.
      - **Pengaturan Titik Booth Mall & Penukaran Voucher Fisik**:
        - Nama Mall, Lantai & Area, Jam Standby, Petunjuk Arah, dan Catatan Khusus.
      - **Pengaturan Rundown Agenda Harian Roadshow**:
        - Tambah/hapus agenda (Jam, Kategori Sekolah/Kampus/Radio/Mall/Screening, Judul, dan Lokasi).
      - **Tombol Reset Default**:
        - Memungkinkan admin mengembalikan jadwal kota tertentu ke pengaturan awal jika diperlukan.
    * **Integrasi Menyeluruh & Reaktivitas Otomatis**:
      - Tersimpan permanen di database (`db.settings.roadshowOverrides[slug]`).
      - Halaman publik kota ([`/city/[slug]`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/city/[slug]/page.tsx)), halaman beranda ([`/`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/page.tsx)), dan semua webhook WhatsApp Wahnotif (`/api/webhook/tickets`, `/api/webhook/roadshow`, `/api/webhook/wahnotif`, `/api/wahnotif/persona`) langsung membaca data kustom tersebut secara real-time.

