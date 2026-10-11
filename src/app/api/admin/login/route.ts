import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
} from '@/lib/auth';
import { validateAdminCredentials } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               req.headers.get('x-real-ip') ||
               '127.0.0.1';

    // 1. Rate Limiting Check
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan gagal. Akses dikunci sementara selama ${rateLimit.remainingLockoutSeconds} detik demi keamanan.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // 2. Validate Credentials
    const isValid = await validateAdminCredentials(username, password);

    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Username atau password salah. Silakan periksa kembali kredensial Anda.',
        },
        { status: 401 }
      );
    }

    // 3. Reset rate limit record on successful login
    resetFailedAttempts(ip);

    // 4. Generate signed session token
    const sessionToken = await createSessionToken(username);

    // 5. Create response with HTTP-Only secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Autentikasi berhasil. Selamat datang di Dashboard!',
      user: { username },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
