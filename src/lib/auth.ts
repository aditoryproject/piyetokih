// Authentication & Security Utilities for Miracle Pictures Admin Dashboard
// Uses Web Crypto API (compatible with Edge Runtime & Node.js)

export const ADMIN_COOKIE_NAME = 'ptk_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'miracle-pictures-piye-to-kih-secret-key-2026-auth-seal';

// Default initial credentials (can be overridden via environment variables or DB settings)
export const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PiyeToKih#2026';

// In-memory rate limiting to prevent brute-force attacks
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkRateLimit(ipOrKey: string): { allowed: boolean; remainingLockoutSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ipOrKey);

  if (record && record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockoutSeconds: remaining };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ipOrKey: string) {
  const now = Date.now();
  const record = loginAttempts.get(ipOrKey) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  // If failed 5 times, lock out for 15 minutes
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000;
  }

  loginAttempts.set(ipOrKey, record);
}

export function resetFailedAttempts(ipOrKey: string) {
  loginAttempts.delete(ipOrKey);
}

// Convert string to Uint8Array as BufferSource
function textToBuffer(str: string): any {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// HMAC-SHA256 signature generator
async function generateSignature(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    textToBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, textToBuffer(data));
  return bufferToHex(signature);
}

// SHA-256 Hash for passwords with salt
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const combined = `${salt}:${password}:${salt}`;
  const digest = await crypto.subtle.digest('SHA-256', textToBuffer(combined));
  return bufferToHex(digest);
}

// Session Token Creator
export async function createSessionToken(username: string): Promise<string> {
  const payload = {
    u: username,
    r: 'admin',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    iat: Date.now(),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = await generateSignature(payloadBase64, SESSION_SECRET);

  return `${payloadBase64}.${signature}`;
}

// Session Token Verifier
export async function verifySessionToken(token: string | undefined | null): Promise<{ valid: boolean; username?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadBase64, signature] = parts;

  try {
    const expectedSignature = await generateSignature(payloadBase64, SESSION_SECRET);
    if (expectedSignature !== signature) {
      return { valid: false };
    }

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false }; // expired
    }

    return { valid: true, username: payload.u };
  } catch (err) {
    return { valid: false };
  }
}
