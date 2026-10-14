const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataDir = path.join(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'db.json');
const bakFile = path.join(dataDir, 'db.json.bak');

console.log('--- RESTORE & PROTECT DATABASE SCRIPT ---');

// 1. Tell Git to stop tracking changes to db.json permanently
try {
  execSync('git update-index --skip-worktree data/db.json', { stdio: 'inherit' });
  console.log('✓ Git proteksi aktif: data/db.json tidak akan pernah ditimpa lagi saat git pull!');
} catch (err) {
  console.log('ℹ Warning saat set skip-worktree:', err.message);
}

// 2. Restore data from backup if available
if (fs.existsSync(bakFile)) {
  try {
    const bakRaw = fs.readFileSync(bakFile, 'utf-8');
    const bak = JSON.parse(bakRaw);

    let current = {};
    if (fs.existsSync(dbFile)) {
      try {
        current = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      } catch {}
    }

    const merged = {
      settings: {
        ...(current.settings || {}),
        ...(bak.settings || {}),
        movieSettings: {
          ...(current.settings?.movieSettings || {}),
          ...(bak.settings?.movieSettings || {})
        }
      },
      leads: Array.isArray(bak.leads) && bak.leads.length > 0 ? bak.leads : (current.leads || []),
      visitors: Array.isArray(bak.visitors) && bak.visitors.length > 0 ? bak.visitors : (current.visitors || []),
      articles: Array.isArray(current.articles) ? current.articles : (Array.isArray(bak.articles) ? bak.articles : []),
      bogoReminders: Array.isArray(bak.bogoReminders) && bak.bogoReminders.length > 0 ? bak.bogoReminders : (current.bogoReminders || [])
    };

    fs.writeFileSync(dbFile, JSON.stringify(merged, null, 2));
    console.log('✓ Berhasil memulihkan seluruh data editan Anda dari data/db.json.bak!');
    console.log(`  - Leads: ${merged.leads.length} data`);
    console.log(`  - Visitors: ${merged.visitors.length} data`);
    console.log(`  - Settings: Berhasil dipulihkan`);
  } catch (err) {
    console.error('✗ Gagal memulihkan backup:', err.message);
  }
} else {
  console.log('ℹ File data/db.json.bak tidak ditemukan. Database saat ini tetap digunakan.');
}

console.log('--- SELESAI ---');
