import fs from 'fs';
import path from 'path';
import { VisitorLog, getDb, saveDb } from './db';

const EXTERNAL_DIR = process.env.EXTERNAL_STORAGE_DIR || path.join(process.cwd(), '..', 'miracleweb-storage');
const EXTERNAL_VISITORS_FILE = path.join(EXTERNAL_DIR, 'visitors.json');
const LOCAL_VISITORS_FILE = path.join(process.cwd(), 'data', 'visitors.json');

const MAX_VISITOR_LOGS = 100000;

let memoryVisitors: VisitorLog[] | null = null;
let saveTimeout: NodeJS.Timeout | null = null;

function loadVisitorsFromDisk(): VisitorLog[] {
  try {
    if (fs.existsSync(EXTERNAL_VISITORS_FILE)) {
      const raw = fs.readFileSync(EXTERNAL_VISITORS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[visitors-store] Failed reading external visitors.json:', e);
  }

  try {
    if (fs.existsSync(LOCAL_VISITORS_FILE)) {
      const raw = fs.readFileSync(LOCAL_VISITORS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[visitors-store] Failed reading local visitors.json:', e);
  }

  // Fallback to existing db.visitors if visitors.json does not exist yet
  try {
    const db = getDb();
    if (Array.isArray(db.visitors) && db.visitors.length > 0) {
      return [...db.visitors];
    }
  } catch {}

  return [];
}

function flushVisitorsToDiskNow() {
  if (!memoryVisitors) return;
  try {
    if (!fs.existsSync(EXTERNAL_DIR)) {
      fs.mkdirSync(EXTERNAL_DIR, { recursive: true });
    }
    const payload = JSON.stringify(memoryVisitors);
    fs.writeFileSync(EXTERNAL_VISITORS_FILE, payload, 'utf-8');
    const localDir = path.dirname(LOCAL_VISITORS_FILE);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_VISITORS_FILE, payload, 'utf-8');
  } catch (e) {
    console.error('[visitors-store] Failed writing visitors.json:', e);
  }
}

function scheduleFlushVisitors() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    flushVisitorsToDiskNow();
  }, 3000);
}

export function getVisitors(): VisitorLog[] {
  if (!memoryVisitors) {
    memoryVisitors = loadVisitorsFromDisk();
  }
  return memoryVisitors;
}

export function addVisitorLog(log: VisitorLog): void {
  const list = getVisitors();
  list.unshift(log);
  if (list.length > MAX_VISITOR_LOGS) {
    list.length = MAX_VISITOR_LOGS;
  }
  scheduleFlushVisitors();
}

export function clearVisitorLogs(): void {
  memoryVisitors = [];
  flushVisitorsToDiskNow();
  try {
    const db = getDb();
    db.visitors = [];
    saveDb(db);
  } catch {}
}

export function reloadVisitorsFromDisk(): VisitorLog[] {
  memoryVisitors = loadVisitorsFromDisk();
  return memoryVisitors;
}
