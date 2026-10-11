import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, ArticleRecord } from '@/lib/db';

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

    return NextResponse.json({ success: true, articles: list });
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
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
      galleryImages: Array.isArray(body.galleryImages)
        ? body.galleryImages.filter((img: string) => img && img.trim())
        : [],
      cityTag: body.cityTag || '',
      category: body.category || 'Roadshow',
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

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel wajib disertakan' }, { status: 400 });
    }

    const db = getDb();
    if (!db.articles) db.articles = [];

    db.articles = db.articles.filter(a => a.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
