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
