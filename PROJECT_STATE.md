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
15. **Perbaikan Tautan Tiket Bioskop Spesifik Per Kota & Eliminasi Total Balasan Ayah/Bunda**:
    * **Masalah 1: Balasan "Ayah/Bunda" & "Kak Admin"**:
      - **Akar Masalah**: Kalimat *"Baik Ayah/Bunda, percakapan ini sudah langsung saya teruskan ke nomor WhatsApp Tim CS/Admin kami (Kak Admin)..."* berasal dari template default sistem Wahnotif saat memicu fitur *Live Agent Handover / Ambil Alih AI*. Ini terpicu karena pesan mitra/penonton (misal meminta kontak tim partnership/kolaborasi/nobar) tidak tertangkap oleh router tool webhook, sehingga Wahnotif memicu handover default-nya.
      - **Solusi Komprehensif**:
        1. Di [`src/app/api/webhook/wahnotif/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts) dan [`src/app/api/webhook/ai-brain/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/ai-brain/route.ts), ditambahkan interceptor lengkap untuk kata kunci `partnership`, `partner`, `kolaborasi`, `kerjasama`, `nobar`, `sponsor`, `media partner`, `berkomunikasi langsung`, `hubungi tim`, dll. Respon langsung dibalas dengan gaya Mas Kidi: *"Siap bolo asik! Mas Kidi sambungkan langsung obrolan ini ke Tim Partnership & Promosi Miracle Pictures ya lur. Tunggu sebentar nggih, tim kami bakal segera balas chat sampean langsung di sini! 🍿✨"* tanpa membiarkan Wahnotif memicu fallback default-nya.
        2. Dibuat Tool 5 baru di skema Wahnotif (`contact_partnership_and_team`) pada [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts) dan didaftarkan pada `/api/webhook/wahnotif`.
        3. Ditambahkan panduan visual jelas di Admin Dashboard ([`src/components/AdminDashboardClient.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/AdminDashboardClient.tsx)) pada tab Wahnotif untuk menginstruksikan pengguna mengganti atau mematikan teks template default di dashboard Wahnotif (menu *AI CS Assistant > Pengaturan Handover / Eskalasi CS*).
    * **Masalah 2: Tautan Tiket Tidak Sesuai Yang Dicantumkan Per Kota di Panel Admin**:
      - **Akar Masalah**: Di [`src/app/api/webhook/wahnotif/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts) pada action `get_roadshow_schedule`, daftar link tiket pada balasan chat sebelumnya masih tertulis hardcoded ke link global XXI & TIX ID (`• Cinema XXI: ${xxiLink}\n• TIX ID: ${tixidLink}`). Akibatnya, saat penonton menanyakan jadwal Solo atau kota lain, bot mengirim link generic `m.21cineplex.com` dan `tix.id` alih-alih link bioskop spesifik yang sudah diinput admin di panel admin (`cityLinkOverrides` seperti `solo_0`, `solo_1`, dll).
      - **Solusi**:
        1. Fungsi [`getCityCinemaTicketLinks`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts) diperbarui agar menerima parameter `cityLinkOverrides?: Record<string, string>` dan otomatis menyelesaikan override per bioskop (`${citySlug}_${idx}`) maupun direct city override (`${citySlug}`).
        2. Di seluruh webhook ([`/api/webhook/wahnotif`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts), [`/api/webhook/roadshow`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/roadshow/route.ts), [`/api/webhook/tickets`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/tickets/route.ts), dan cron follow-up), pemanggilan `getCityCinemaTicketLinks` kini menyertakan `db.settings.cityLinkOverrides`.
        3. Format balasan chat kini mencantumkan setiap venue bioskop beserta jam tayang dan URL langsung pemesanannya:
           ```
           🎟️ LINK INFORMASI & TIKET PRESALE (SPECIAL SCREENING):
           • SOLO PARAGON XXI (12.15 WIB):
             👉 https://m.21cineplex.com/id/movies/16PTKH
           • PLATINUM CINEPLEX PAKUWON MALL SOLO BARU (19.00 WIB):
             👉 https://www.platinumcineplex.co.id/now-showing-booking/482/1/
           • Cek Rundown Lengkap: https://piyetokihfilm.com/city/solo
           • TIX ID: https://rb.gy/l28pzj
           ```
           Sehingga penonton langsung mendapatkan tautan presale bioskop kota yang bersangkutan tanpa salah link!

10. **Sistem Follow-Up & Broadcast Presale Roadshow (Anti-Spam Meta, Multi-Stage Nurturing, Filter Kota, & Auto-Stop Cerdas)**:
    * **Keamanan Anti-Spam Meta / WhatsApp**:
      - Menyediakan opsi jeda waktu (delay) fleksibel dari 8 detik (standar aman), 20 detik, 45 detik, hingga 6-8 menit (360-480 detik ultra-safe) untuk pencegahan banned/spam oleh Meta.
      - Random human jitter otomatis (0 - 2000 ms) di setiap jeda pengiriman.
      - Dynamic spintax pantun Mas Kidi dan sapaan personal penerima sehingga hash pesan WhatsApp selalu variatif dan unik.
    * **Filter Per Kota Roadshow**:
      - Pengiriman follow-up dapat difilter per kota tertentu (misal: Solo saja, Semarang saja, Jogja saja) atau semua kota, sehingga broadcast presale roadshow tepat sasaran sesuai jadwal kota terdekat.
    * **3 Stage Nurturing Nonton Duluan / Special Screening**:
      - **Stage 1 (Soft Nudge & Cek Tiket)**: Sapa santai, mengabarkan presale special screening bareng cast sudah dibuka di kotanya.
      - **Stage 2 (Urgensi Kursi Menipis)**: Eskalasi urgensi bahwa kursi studio nonton duluan makin menipis, mengajak segera checkout kursi terbaik.
      - **Stage 3 (Closing Final SUDAH/MAU/SKIP)**: Meminta kepastian singkat: balas SUDAH (sudah beli), MAU (butuh link), atau SKIP (batal/lewatkan).
    * **Auto-Stop Cerdas Saat Audiens Merespons**:
      - Webhook inbound Wahnotif (`/api/webhook/wahnotif`) mendeteksi jawaban konfirmasi positif (`sudah`, `udah beli`, `oke`, `siap`, `dapat tiket`) maupun negatif (`skip`, `gak jadi`, `tidak jadi`, `batal`).
      - Nomor kontak otomatis ditandai `presaleFollowupStatus: 'responded'` dan `presaleFollowupResponse: 'bought' | 'declined'`.
      - Sistem secara otomatis **menghentikan follow-up berikutnya** ke nomor tersebut agar tidak mengganggu penonton.
    * **Panel Admin Modal Interaktif**:
      - UI Modal interaktif di Admin Dashboard (`/admin`) dengan live preview teks pesan, filter target audiens (Leads / Reminders / All), pemilih kota, stage nurturing, opsi jeda aman, dan counter nomor eligible secara real-time.

17. **Penanganan Pertanyaan Harga Tiket (Rentang Perkiraan Rp 30.000 – Rp 50.000) & Eliminasi Total Istilah 'Katalog / Toko Kami' di CS AI Wahnotif**:
    * **Latar Belakang & Masalah**:
      - Calon penonton di WhatsApp bertanya: *"Tp saya msh penasaran berapa harganya tiket nya bosku"*.
      - Karena webhook dan prompt sebelumnya belum memiliki penanganan khusus untuk kata kunci harga/HTM, bot Wahnotif memicu fallback bawaan e-commerce: *"Bisa banget Kak! Untuk proses pembayaran dan pemesanan, Kakak bisa langsung cek di katalog/website toko kami atau admin toko akan segera bantu kirimkan detail transaksinya ya. 🙏😊"*.
      - Ini merusak persona karena film bioskop disangka toko online ("katalog toko", "admin toko", sapaan "Kakak").
    * **Standar Respon Resmi Mas Kidi**:
      1. **Rentang Perkiraan Harga (HTM)**: Menjelaskan bahwa harga tiket nonton film *PIYE TO KIH?* berkisar antara **Rp 30.000 sampai Rp 50.000** per tiket (menyesuaikan jaringan bioskop XXI/CGV/Cinépolis/Platinum/NSC, wilayah kota, serta hari biasa weekday vs akhir pekan weekend).
      2. **Pengalihan Langsung ke Link Website Bioskop Sesuai Landing Page**: Langsung menyodorkan tautan resmi bioskop (Cinema XXI/M-TIX, TIX ID, CGV Cinemas, Cinépolis, atau link bioskop spesifik kotanya) agar penonton dapat mengecek harga pasti di kotanya dan langsung mengamankan nomor kursi terbaik sebelum habis.
      3. **Tips Hemat Promo**: Menginfokan sesi Nonton Duluan (Special Screening) sebelum 19 Nov, promo Buy 1 Get 1 (19 Nov), dan voucher potongan Rp 10.000 di booth roadshow mall.
      4. **Hardsale Closing Khas Mas Kidi**: Mendorong checkout segera (*"Mukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae nunda-nunda? 😂"*).
    * **Eliminasi Total Kata E-Commerce**:
      - Dilarang keras menggunakan istilah: "katalog toko", "website toko", "admin toko", "proses pembayaran toko", "detail transaksi toko", serta sapaan "Kak/Kakak/Ayah/Bunda".
    * **File Terkait yang Ter-update**:
      - [`src/lib/bot-knowledge.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/bot-knowledge.ts): Ditambahkan `ticketPricing` pada `MASTER_MOVIE_FACTS`.
      - [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts): Update deskripsi tool `get_ticket_links`, `konteksBisnis`, aturan 7 `teknikClosing`, `karakterPersona`, FAQ #6, `systemPrompt`, dan `sampleDialogs`.
      - [`src/app/api/webhook/wahnotif/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts) & [`src/app/api/webhook/tickets/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/tickets/route.ts): Interceptor `isPriceInquiry` (`harga`, `harganya`, `htm`, `biaya`, `tarif`, `berapaan`, `berapa tiket`, dll.) otomatis membalas dengan rentang harga Rp 30.000 - Rp 50.000 dan link bioskop landing page.
      - [`src/app/api/webhook/ai-brain/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/ai-brain/route.ts): Sinkronisasi jawaban harga tiket dan link bioskop.
      - [`src/components/AdminDashboardClient.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/AdminDashboardClient.tsx): Ditambahkan alert panduan harga tiket (30-50 ribu) dan panduan anti-toko di Tab Wahnotif.

18. **Pembaruan Kontak Media Relations (+62 852-2095-2407) & Isolasi Total Floating Widget Mas Kidi**:
     * **Investigasi Akar Masalah Chat Mas Kidi Masuk ke WA Tim Media Relations**:
       - Tim media relation menerima ratusan chat WA dengan format template Mas Kidi (*"Halo Mas Kidi! Piye kabare? Mau tanya-tanya seputar film komedi PIYE TO KIH? THE MOVIE dong lur! ✨"*).
       - Ditemukan akar penyebab pada `src/app/layout.tsx` dan `src/components/FloatingWhatsAppWidget.tsx`: komponen floating widget sebelumnya memiliki kode fallback otomatis `whatsappNumber = db.settings.wahnotifSenderNumber || db.settings.kabarGaleriSettings?.mediaKitContactWa || '6285691921764'`.
       - Karena `wahnotifSenderNumber` di database kosong, widget otomatis meminjam nomor WhatsApp Media Relations (`mediaKitContactWa` / `085691921764`). Akibatnya, setiap pengunjung website yang mengklik tombol floating "Tanya Mas Kidi" dan memilih opsi chat langsung diarahkan ke nomor pribadi tim media relation.
     * **Pembaruan Nomor Kontak Resmi Media Relations**:
       - Mengubah kontak Media Relations resmi menjadi **`+62 852-2095-2407`** (format angka: `6285220952407`) di seluruh database (`data/db.json`, `data/db.persist.json`), skema default `src/lib/db.ts`, halaman media `src/app/media/page.tsx`, dan Admin Dashboard `src/components/AdminDashboardClient.tsx`.
     * **Isolasi Total Widget Mas Kidi Dari Kontak Personal / Media**:
       - Menghapus total seluruh fallback ke nomor media relation (`mediaKitContactWa`) maupun nomor hardcoded `6285691921764`.
       - `src/app/layout.tsx` kini murni hanya mengoper `db.settings.wahnotifSenderNumber || ''`.
       - `src/components/FloatingWhatsAppWidget.tsx` kini secara protektif menyembunyikan diri (`return null`) jika nomor bot resmi (`wahnotifSenderNumber`) belum disetting atau kosong, sehingga dipastikan tidak akan ada nomor pribadi tim mana pun yang bocor atau menerima chat nyasar.

19. **Pemasangan Nomor Official Bot Mas Kidi (6285220954750) Pada Floating Widget & Pemisahan Total Dari Nomor Media (+62 852-2095-2407)**:
     * **Nomor Official Bot Mas Kidi**: **`6285220954750`** (`+62 852-2095-4750`).
     * **Nomor Media Relations**: **`+62 852-2095-2407`** (`6285220952407`).
     * **Konfigurasi Widget Melayang**:
       - Mengembalikan tombol floating/sticky "Tanya Mas Kidi" ke seluruh halaman publik dengan nomor resmi **`6285220954750`**.
       - Menjadikan `6285220954750` sebagai default fallback langsung di `src/app/layout.tsx`, `src/components/FloatingWhatsAppWidget.tsx`, dan `src/lib/db.ts`.
       - Database `wahnotifSenderNumber` disinkronkan ke `6285220954750`.
       - Menjamin 100% obrolan Mas Kidi hanya mengarah ke nomor official bot (`6285220954750`) dan tidak pernah bocor ke nomor media relations.

20. **Sinkronisasi Total 17 Kota Roadshow Website vs Webhook / Wahnotif AI & Eliminasi Halusinasi Kota**:
     * **Latar Belakang & Investigasi Masalah**:
       - Calon penonton bertanya di WhatsApp: *"temu cast nya ada dikota mna saaja?"*.
       - Bot AI Wahnotif menjawab dengan daftar kota halusinasi fiktif yang salah total (mencantumkan Kudus 25 Okt, Salatiga 26 Okt, Klaten 27 Okt, Purwokerto 29 Okt, Tegal 30 Okt, Jember 6 Nov, Jakarta 12 Nov) dengan sapaan terlarang *"Kak!"*.
       - **Penyebab Utama**:
         1. Pada skema tool `get_roadshow_schedule` (`src/lib/wahnotif.ts`), properti `city` memiliki syarat `required: ["city"]`. Ketika user bertanya pertanyaan umum tanpa nama kota, AI Wahnotif tidak memanggil tool dan memilih berhalusinasi sendiri dari bobot modelnya.
         2. Pada webhook `src/app/api/webhook/wahnotif/route.ts`, router Sub-Router 1 mensyaratkan `if (isRoadshowAction && (cityParam || detectedCityRes))`. Karena `cityParam` dan `detectedCityRes` kosong, query daftar kota dilewati begitu saja.
         3. Pada webhook `src/app/api/webhook/roadshow/route.ts`, jika nama kota tidak cocok (`!matchedSlug`), string pertanyaan umum user justru diubah menjadi nama kota display (`"Halo bolo asik di TEMU CAST NYA ADA DIKOTA MNA SAAJA!..."`).
     * **Solusi & Sinkronisasi Sesuai Website (`src/lib/cities.ts`)**:
       - Mengimpor `CITIES_DATA` langsung ke webhook `/api/webhook/roadshow` dan `/api/webhook/wahnotif`.
       - Menangani query umum daftar kota / temu cast (`isGeneralCityQuery`) dengan langsung mengembalikan **17 Kota Resmi** lengkap beserta tanggal asli sesuai website:
         1. Semarang (22 Oktober 2026)
         2. Yogyakarta (23 Oktober 2026)
         3. Magelang (24 Oktober 2026)
         4. Surakarta (Solo) (25 Oktober 2026)
         5. Sragen (26 Oktober 2026)
         6. Ngawi (27 Oktober 2026)
         7. Madiun (28 Oktober 2026)
         8. Ponorogo (29 Oktober 2026)
         9. Nganjuk (30 Oktober 2026)
         10. Mojokerto (31 Oktober 2026)
         11. Gresik (1 November 2026)
         12. Surabaya (2 November 2026)
         13. Sidoarjo (3 November 2026)
         14. Malang (4 November 2026)
         15. Kediri (6 November 2026) — Puncak Home Premiere
         16. Blitar (8 November 2026)
         17. Tulungagung (8 November 2026)
       - Pada `src/lib/wahnotif.ts`, menghapus syarat `required: ["city"]`, menambahkan aturan anti-halusinasi eksplisit yang melarang penyebutan kota fiktif (Kudus, Salatiga, Klaten, Purwokerto, Tegal, Jember, Jakarta), menyinkronkan FAQ #2 menjadi tepat 17 kota, dan menambahkan sample dialog untuk pertanyaan temu cast.
       - Menambahkan proteksi non-roadshow jika audiens menyebut kota lain (Jakarta, Bandung, Medan, Kudus, dll) agar langsung diarahkan ke penayangan serentak 19 November di bioskop kotanya.

21. **Koreksi Fatal Logika Program Tebus Murah Voucher Rp 10.000 (Berlaku Sebesar Harga Tiket Penuh di Bioskop, Anti Diskon/Potongan) & Eliminasi Total Balasan Pantun CS AI Wahnotif**:
    * **Investigasi & Koreksi Fatal Penjelasan Voucher (Bukti Screenshot WhatsApp)**:
      - **Kesalahan Fatal Sebelumnya**: Bot AI Wahnotif sebelumnya mengasumsikan kata "voucher fisik potongan Rp 10.000" sebagai diskon nominal. Bot berhalusinasi dan membuat simulasi hitungan keliru di WhatsApp: *"Harga normal bioskop: Rp 40.000, voucher potongan: Rp 10.000, jadi tinggal bayar ke kasir bioskop Rp 40.000 - Rp 10.000 = Rp 30.000"*.
      - **Logika Bisnis yang Benar & Terkunci**: Program ini adalah **TEBUS MURAH TIKET BIOSKOP RP 10.000**.
        1. Calon penonton booking online lewat WhatsApp/website untuk mendapatkan Kode Booking resmi.
        2. Kode Booking ini dibawa ke booth roadshow meet & greet offline di mall, lalu ditebus dengan membayar Rp 10.000 untuk mendapatkan lembaran **Voucher Fisik resmi**.
        3. Lembaran voucher fisik ini dibawa ke kasir bioskop yang menayangkan film *PIYE TO KIH?* pada tanggal 19–20 November 2026 dan **BERLAKU SEBESAR HARGA TIKET PENUH** di lokasi tersebut (penonton **TIDAK PERLU** membayar sepeser pun lagi di kasir bioskop!).
      - **Aturan Mutlak Anti-Diskon/Anti-Potongan**: Dilarang keras menyebut atau menjelaskan program ini sebagai diskon atau potongan harga. Dilarang keras membuat simulasi pengurangan harga tiket bioskop.
      - **Aturan Penukaran Kasir Bioskop**: Kasir bioskop HANYA menerima lembaran voucher fisik asli saat penayangan 19–20 November 2026. Kasir bioskop TIDAK melayani penukaran kode booking di HP. Kode booking WA wajib ditebus dulu di booth mall roadshow.
    * **Eliminasi Total Balasan Pantun CS AI Wahnotif**:
      - Seluruh pantun bot dihapus total dari database pengetahuan (`MAS_KIDI_PANTUN = []`), persona Wahnotif, template chat, prompt Gemini multimodal, webhook response, dan auto-followup presale karena dinilai tidak bagus/norak oleh user.
      - Mas Kidi tetap ramah, guyub, dan humoris dengan bahasa tongkrongan santai khas Jawa tanpa berpantun sama sekali.
    * **File-File yang Dimodifikasi**:
      - [`src/lib/bot-knowledge.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/bot-knowledge.ts): Dikosongkan `MAS_KIDI_PANTUN = [];`, ditambahkan `VOUCHER_TEBUS_MURAH_FACTS` yang merinci aturan mutlak tebus murah Rp 10.000 seharga tiket penuh.
      - [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts): Dihapus referensi pantun dari tone & prompt persona; ditambahkan aturan mutlak di `konteksBisnis`, `teknikClosing`, `dataPengetahuanFAQ`, `systemPrompt`, dan `sampleDialogs`; diperbarui skema tool voucher & roadshow; diperbarui template pesan notifikasi voucher.
      - [`src/app/api/webhook/wahnotif/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts): Ditambahkan SUB-ROUTER 0.5 interceptor penjelasan voucher tebus murah 10k anti-potongan; dibersihkan `${randomPantun}` dari seluruh balasan; diperbarui prompt multimodal gambar tanpa pantun.
      - [`src/app/api/webhook/voucher/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/voucher/route.ts): Dihapus `MAS_KIDI_PANTUN` & `randomPantun`, diperbarui deskripsi dan pesan booking voucher tebus murah seharga tiket penuh.
      - [`src/app/api/webhook/roadshow/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/roadshow/route.ts): Dihapus pantun, diperbarui teks penawaran voucher tebus murah.
      - [`src/app/api/webhook/tickets/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/tickets/route.ts): Dihapus pantun, ditambahkan poin tips hemat tebus murah voucher fisik Rp 10.000 seharga tiket penuh.
      - [`src/app/api/webhook/movie-info/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/movie-info/route.ts): Dihapus pantun dari pesan balasan.
      - [`src/app/api/webhook/ai-brain/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/ai-brain/route.ts): Dihapus pantun, ditambahkan handler tebus murah voucher 10k seharga tiket penuh.
      - [`src/app/api/cron/presale-followup/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/cron/presale-followup/route.ts): Dihapus pantun dari seluruh template follow-up stage 1, 2, dan 3.
      - [`src/components/AdminDashboardClient.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/AdminDashboardClient.tsx): Diperbarui keterangan anti-spam follow-up dari pantun menjadi variasi guyonan khas Mukidi.

22. **Reduksi Pengulangan Slogan FOMO "Mukidi Beda Alam" (Cukup 1x Saja) & Penyelarasan Jam Special Screening Sesuai Jam Film Dimulai di Web Bioskop (Anti-Misleading)**:
     * **Reduksi Kalimat FOMO "Mukidi Beda Alam"**:
       - Kalimat *"Ibaratnya Mukidi wae sing beda alam wani berjuang, mosok sampean tuku tiket wae nunda-nunda? Gasik lur ben gak kentekan! 😂 Mending amankan kursi favoritmu sekarang juga sebelum beneran kehabisan!"* sebelumnya selalu berulang di setiap pesan balasan bot.
       - Diberikan aturan tegas di [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts): Kalimat FOMO ini **HANYA BOLEH DIKELUARKAN MAKSIMAL 1 KALI SAJA** saat pertama kali menawarkan tiket. Pada chat lanjutan, bot dilarang mengulanginya dan wajib menggunakan penutup ramah biasa yang natural (*"Ada yang mau ditanyakan lagi lur?"*, *"Mau Mas Kidi bantu cek apa lagi lur?"*, *"Sampai ketemu di bioskop nggih! 🍿✨"*).
       - Menghapus pengulangan hardcoded slogan tersebut di seluruh endpoint webhook ([`/api/webhook/wahnotif`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts), [`/api/webhook/tickets`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/tickets/route.ts), [`/api/webhook/roadshow`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/roadshow/route.ts), dan [`/api/webhook/ai-brain`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/ai-brain/route.ts)).
     * **Penyelarasan Jam Special Screening Sesuai Web Bioskop (Anti-Misleading)**:
       - **Akar Masalah**: Bot sebelumnya menginfokan jam cast masuk menyapa saat film selesai (misal 16.45 WIB Ambarrukmo XXI dan 19.15 WIB Jogja City XXI), sehingga penonton mengira itu adalah jam film dimulai dan berisiko datang terlambat saat film sudah selesai.
       - **Koreksi & Aturan Mutlak**:
         1. Jam yang ditampilkan untuk Special Screening **WAJIB MENGIKUTI JAM FILM DIMULAI DI WEB BIOSKOP** (M-TIX / XXI / CGV / Cinepolis).
         2. Di Yogyakarta: **Plaza Ambarrukmo XXI dimulai jam 14.30 WIB** dan **Jogja City XXI dimulai jam 16.30 WIB**.
         3. Diberikan briefing jelas kepada penonton: Penonton wajib masuk studio tepat waktu sesuai jam film dimulai. Rombongan cast (Mukidi, Sukma, Gendut, Penyok, dll) akan hadir menyapa penonton, ngobrol santai, dan foto bersama saat film selesai (credit title).
       - Diperbarui pada [`src/lib/bot-knowledge.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/bot-knowledge.ts), [`src/lib/cities.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/cities.ts), [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts), serta seluruh endpoint webhook.



23. **Perbaikan Presisi Router Roadshow & Narasi Khas Piye To Kih Untuk Kota Expired (Pengalihan ke BOGO 19 Nov)**:
     * **Investigasi Masalah & Intersepsi Keliru**:
       - Pesan bawaan widget (*"Halo Mas Kidi! Mau tanya jadwal lengkap roadshow, temu pemain, & booth voucher di kotaku dong."*) sebelumnya keliru diintersepsi oleh sub-router penjelasan voucher karena mencocokkan kata "voucher" secara agresif.
       - Pesan jawaban kota singkat (seperti *"Semarang ak"*, *"Semarang"*, *"di semarang"*) sebelumnya terlewat ke welcome prompt generic karena `isRoadshowAction` mewajibkan kata kunci spesifik seperti "jadwal/kapan".
     * **Perbaikan Alur Webhook & Router**:
       - Membatasi sub-router penjelasan voucher agar hanya aktif bila audiens benar-benar bertanya mekanisme/definisi diskon/potongan/tebus murah, dan tidak mengintersepsi pertanyaan jadwal roadshow.
       - Setiap penyebutan nama kota secara otomatis mengaktifkan action roadshow kota tersebut.
       - Pertanyaan jadwal roadshow tanpa nama kota (atau bilang *"di kotaku dong"*) langsung disambut ramah dengan menanyakan balik nama kotanya disertai daftar 17 kota roadshow.
     * **Narasi Khas Piye To Kih Untuk Kota Roadshow yang Sudah Selesai (Expired)**:
       - Ketika audiens bertanya kota yang jadwal roadshow-nya sudah lewat (contoh: Semarang 22 Okt, Yogyakarta 23 Okt, Magelang 24 Okt):
         Bot Mas Kidi secara otomatis menjelaskan dengan nada medok dan santai bahwa rombongan roadshow temu pemain kemarin sudah rampung dikunjungi dan booth voucher di mall resmi ditutup.
       - Audiens langsung diarahkan dengan penuh semangat (*"Ojo cilik ati! Mukidi wae sing beda alam wani berjuang..."*) ke penayangan serentak bioskop 19 November 2026 di kota tersebut dengan Promo Buy 1 Get 1 (BOGO).
       - Menyediakan tautan cepat bioskop kota tersebut dan mengajak pendaftaran Pengingat Prioritas H-1 via WA.
     * **File-File Terkait**:
       - [`src/app/api/webhook/wahnotif/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/wahnotif/route.ts)
       - [`src/app/api/webhook/roadshow/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/roadshow/route.ts)
       - [`src/app/api/webhook/ai-brain/route.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/api/webhook/ai-brain/route.ts)
       - [`src/lib/wahnotif.ts`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/lib/wahnotif.ts)
