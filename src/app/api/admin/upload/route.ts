import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Session
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Sesi admin tidak valid.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'movie';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file yang diunggah.' }, { status: 400 });
    }

    // 2. Check File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file melebihi batas maksimal (Maks. 10MB).' },
        { status: 400 }
      );
    }

    // 3. Strict MIME type whitelist (raster images only to prevent script execution)
    const mime = file.type;
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(mime)) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Harap gunakan file gambar JPG, PNG, atau WebP.' },
        { status: 400 }
      );
    }

    // Determine extension
    let ext = 'jpg';
    if (mime === 'image/png') ext = 'png';
    else if (mime === 'image/webp') ext = 'webp';
    else if (mime === 'image/gif') ext = 'gif';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const externalUploadsDir = path.join(process.cwd(), '..', 'miracleweb-storage', 'uploads');
    try {
      if (!fs.existsSync(externalUploadsDir)) {
        fs.mkdirSync(externalUploadsDir, { recursive: true });
      }
    } catch {}

    const cleanCategory = category.replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${cleanCategory}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Backup copy to external directory (immune to git operations)
    try {
      fs.writeFileSync(path.join(externalUploadsDir, filename), buffer);
    } catch {}

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal mengunggah file' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const externalUploadsDir = path.join(process.cwd(), '..', 'miracleweb-storage', 'uploads');

    const fileMap = new Map<string, { filename: string; url: string; size: number; mtime: number }>();

    [uploadsDir, externalUploadsDir].forEach(dir => {
      try {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (f.startsWith('.') || f.endsWith('.gitkeep')) continue;
            try {
              const stat = fs.statSync(path.join(dir, f));
              fileMap.set(f, {
                filename: f,
                url: `/uploads/${f}`,
                size: stat.size,
                mtime: stat.mtimeMs,
              });
            } catch {}
          }
        }
      } catch {}
    });

    const files = Array.from(fileMap.values()).sort((a, b) => b.mtime - a.mtime);
    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, files: [] });
  }
}
