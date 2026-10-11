import { getDb, saveDb } from './db';
import {
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
  hashPasswordWithSalt,
} from './auth';

/**
 * Validates admin credentials against DB settings, environment variables, or defaults.
 */
export async function validateAdminCredentials(usernameInput: string, passwordInput: string): Promise<boolean> {
  const cleanUser = (usernameInput || '').trim();
  const cleanPass = (passwordInput || '').trim();

  if (!cleanUser || !cleanPass) return false;

  const db = getDb();
  const storedUser = db.settings.adminUsername || DEFAULT_ADMIN_USERNAME;

  // Case-insensitive username comparison
  if (cleanUser.toLowerCase() !== storedUser.toLowerCase()) {
    return false;
  }

  // If a custom hashed password exists in DB settings
  if (db.settings.adminPasswordHash && db.settings.adminPasswordSalt) {
    const computedHash = await hashPasswordWithSalt(cleanPass, db.settings.adminPasswordSalt);
    return computedHash === db.settings.adminPasswordHash;
  }

  // Otherwise check against env variable or default password
  return cleanPass === DEFAULT_ADMIN_PASSWORD;
}

/**
 * Updates admin password in DB settings
 */
export async function updateAdminCredentials(newUsername: string, newPassword: string): Promise<void> {
  const db = getDb();
  const salt = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const hash = await hashPasswordWithSalt(newPassword.trim(), salt);

  db.settings.adminUsername = newUsername.trim() || DEFAULT_ADMIN_USERNAME;
  db.settings.adminPasswordHash = hash;
  db.settings.adminPasswordSalt = salt;

  saveDb(db);
}
