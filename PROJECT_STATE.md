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

7. **Floating WhatsApp Widget (Mas Kidi AI CS Fast-Track) Mobile-Responsive**:
   * **Komponen Baru**: [`src/components/FloatingWhatsAppWidget.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/components/FloatingWhatsAppWidget.tsx) dimuat global di [`src/app/layout.tsx`](file:///Users/maulanaadipriatna/Documents/Miracleweb/src/app/layout.tsx).
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


