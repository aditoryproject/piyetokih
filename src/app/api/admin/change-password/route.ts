import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { validateAdminCredentials, updateAdminCredentials } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify session
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session.valid || !session.username) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Harap login kembali.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Password saat ini dan password baru wajib diisi.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password baru minimal harus 8 karakter demi keamanan.' },
        { status: 400 }
      );
    }

    // 2. Validate current password
    const isCurrentValid = await validateAdminCredentials(session.username, currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: 'Password saat ini tidak sesuai.' },
        { status: 401 }
      );
    }

    // 3. Update in DB
    const finalUsername = (newUsername && newUsername.trim()) ? newUsername.trim() : session.username;
    await updateAdminCredentials(finalUsername, newPassword);

    return NextResponse.json({
      success: true,
      message: 'Kredensial dashboard berhasil diperbarui!',
      user: { username: finalUsername },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal mengubah password.' },
      { status: 500 }
    );
  }
}
