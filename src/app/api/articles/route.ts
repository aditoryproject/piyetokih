import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb, saveDb, ArticleRecord } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get('publishedOnly') === 'true';
    const city = searchParams.get('city');

    let list = db.articles || [];

    if (publishedOnly) {
      list = list.filter(a => a.isPublished);
    }

    if (city) {
      list = list.filter(a => a.cityTag?.toLowerCase() === city.toLowerCase());
    }

    return NextResponse.json(
      { success: true, articles: list },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Judul artikel wajib diisi!' },
        { status: 400 }
      );
    }

    const slug =
      body.slug && body.slug.trim()
        ? body.slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : body.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

    const articleId = body.id || `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newArticle: ArticleRecord = {
      id: articleId,
      slug,
      title: body.title,
      summary: body.summary || '',
      content: body.content || '',
      coverImage:
        body.coverImage ||
        '/kabar-galeri-hero.jpg',
      galleryImages: Array.isArray(body.galleryImages)
        ? body.galleryImages.filter((img: string) => img && img.trim())
        : [],
      cityTag: body.cityTag || '',
      category: body.category || 'Kabar Film',
      tag: body.tag || '',
      tags: Array.isArray(body.tags) ? body.tags : (body.tag ? [body.tag] : []),
      featured: Boolean(body.featured),
      ctaText: body.ctaText || '',
      ctaLink: body.ctaLink || '',
      pdfUrl: body.pdfUrl || '',
      externalUrl: body.externalUrl || '',
      mediaName: body.mediaName || '',
      videoUrl: body.videoUrl || '',
      videoDuration: body.videoDuration || '',
      photoCount: body.photoCount ? Number(body.photoCount) : (Array.isArray(body.galleryImages) ? body.galleryImages.length : 0),
      location: body.location || '',
      author: body.author || 'Tim Media Miracle Pictures',
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      readTime: body.readTime || '3 menit baca',
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.summary,
    };

    if (!db.articles) {
      db.articles = [];
    }

    const existingIdx = db.articles.findIndex(a => a.id === articleId || a.slug === slug);
    if (existingIdx >= 0) {
      db.articles[existingIdx] = newArticle;
    } else {
      db.articles.unshift(newArticle);
    }

    saveDb(db);

    try {
      revalidatePath('/kabar-galeri');
      revalidatePath('/artikel');
      revalidatePath(`/kabar-galeri/${slug}`);
      revalidatePath(`/artikel/${slug}`);
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deleteAll = searchParams.get('deleteAll') === 'true';
    const id = searchParams.get('id');

    const db = getDb();
    if (!db.articles) db.articles = [];

    if (deleteAll) {
      db.articles = [];
      // Bersihkan juga dummy hero di kabarGaleriSettings jika masih default
      if (db.settings?.kabarGaleriSettings) {
        db.settings.kabarGaleriSettings.heroTitle = 'Kabar & Galeri Resmi Film PIYE TO KIH?';
        db.settings.kabarGaleriSettings.heroExcerpt = 'Pusat informasi resmi penayangan bioskop film PIYE TO KIH?: liputan roadshow, galeri dokumentasi foto, video cuplikan, dan siaran pers.';
        db.settings.kabarGaleriSettings.heroCtaText = 'Kunjungi Jadwal Roadshow';
        db.settings.kabarGaleriSettings.heroCtaLink = '/#roadshow';
      }
      saveDb(db);

      try {
        revalidatePath('/kabar-galeri');
        revalidatePath('/artikel');
        revalidatePath('/');
      } catch {}

      return NextResponse.json({ success: true, message: 'Semua artikel berhasil dibersihkan' });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel wajib disertakan' }, { status: 400 });
    }

    db.articles = db.articles.filter(a => a.id !== id);
    saveDb(db);

    try {
      revalidatePath('/kabar-galeri');
      revalidatePath('/artikel');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
