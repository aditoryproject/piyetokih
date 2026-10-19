<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 🚨 MANDATORY AGENT OPERATIONAL RULES (LOCK & ISOLATION)
1. **BACA `PROJECT_STATE.md` SEBELUM MELAKUKAN UPDATE**:
   * Selalu rujuk [`PROJECT_STATE.md`](file:///Users/maulanaadipriatna/Documents/Miracleweb/PROJECT_STATE.md) untuk melihat riwayat update dan peta arsitektur file. Hindari membaca seluruh file kode jika tidak perlu agar **hemat token**.
2. **ISOLASI TOTAL VPS (DILARANG MENYENGGOL PROJECT LAIN DI VPS)**:
   * Server VPS `187.127.218.82` menampung 5 website aktif (`adsight.id` port 3000, `playlist` port 3001, `piyetokihfilm.com` port 3005, `kanban` port 3100, `socialedge` port 5002).
   * Proyek ini **HANYA BERHAK MENYENTUH**:
     * Folder: `/home/piyetokihfilm/htdocs/piyetokihfilm.com`
     * Port: **`3005`**
     * PM2 Service: **`piyetokih-web`**
   * **DILARANG KERAS**:
     * Menggunakan perintah kill port global (`fuser -k`, `killall node`, dsb).
     * Menjalankan `pm2 kill`, `pm2 restart all`, atau `pm2 delete all`.
     * Mengotak-atik file nginx vhost domain lain.
     * Mengakses tool MCP Hostinger / membuka browser eksternal tanpa izin user.
   * **Perintah deploy resmi**:
     `ssh root@187.127.218.82 "cd /home/piyetokihfilm/htdocs/piyetokihfilm.com && git pull origin main && npm run build && pm2 reload piyetokih-web"`
