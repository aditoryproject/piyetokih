import type { Metadata } from 'next';
import './globals.css';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import { getDb } from '@/lib/db';
import AdminMaintenanceBanner from '@/components/AdminMaintenanceBanner';
import PublicHeader from '@/components/PublicHeader';
import ComingSoonView from '@/components/ComingSoonView';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import { cookies, headers } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export const metadata: Metadata = {
  metadataBase: new URL('https://piyetokihfilm.com'),
  title: {
    default: 'PIYE TO KIH? THE MOVIE - Official Website Film Bioskop',
    template: '%s | PIYE TO KIH? THE MOVIE',
  },
  description:
    'Official website resmi film komedi bioskop PIYE TO KIH? THE MOVIE produksi Miracle Pictures. Karya Sutradara Ito Mavin, tayang serentak di bioskop mulai 19 November 2026. Lulus Sensor LSF 13+.',
  keywords: [
    'Piye To Kih',
    'Piye Toh Kih',
    'Film Piye To Kih',
    'Miracle Pictures',
    'Ito Mavin',
    'Film Bioskop Komedi',
    'Woko Channel',
    'Film Indonesia 2026',
    'LSF 13+',
  ],
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/logo-ptk.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://piyetokihfilm.com/',
    siteName: 'PIYE TO KIH? THE MOVIE',
    title: 'PIYE TO KIH? THE MOVIE - Official Website Film Bioskop',
    description:
      'Official website resmi film komedi bioskop PIYE TO KIH? THE MOVIE produksi Miracle Pictures. Karya Sutradara Ito Mavin, tayang serentak di bioskop mulai 19 November 2026. Lulus Sensor LSF 13+.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PIYE TO KIH? THE MOVIE - Miracle Pictures',
        type: 'image/jpeg',
      },
      {
        url: '/logo-ptk.png',
        width: 1234,
        height: 777,
        alt: 'Logo Resmi PIYE TO KIH? THE MOVIE',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIYE TO KIH? THE MOVIE - Official Website Film Bioskop',
    description:
      'Official website resmi film komedi bioskop PIYE TO KIH? THE MOVIE produksi Miracle Pictures. Tayang serentak di bioskop mulai 19 November 2026.',
    images: ['https://piyetokihfilm.com/og-image.jpg'],
  },
  referrer: 'strict-origin-when-cross-origin',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = getDb();
  const isMaintenanceMode = Boolean(db.settings.isMaintenanceMode);

  // Authenticate session securely (Strict Admin Verification)
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isAdmin = Boolean(session?.valid);

  // Read current request path from middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isPublicRoute = !pathname.startsWith('/admin') && !pathname.startsWith('/api');

  // Condition to show Coming Soon: maintenance mode is active, user is NOT admin, and route is public
  const showComingSoon = isMaintenanceMode && !isAdmin && isPublicRoute;

  return (
    <html lang="id">
      <head>
        {/* DNS prefetch for external tracking endpoints */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preload critical LCP Hero Images in WebP format */}
        <link rel="preload" as="image" href="/logo-ptk.webp" type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/logo-miracle-pictures.webp" type="image/webp" fetchPriority="high" />

        {/* Favicon & Web Icons using Logotype */}
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
        <link rel="icon" type="image/png" href="/logo-ptk.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />

        {/* Crawler Direct Fallback Meta Tags (WhatsApp, Facebook, Twitter, Telegram) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://piyetokihfilm.com/" />
        <meta property="og:site_name" content="PIYE TO KIH? THE MOVIE" />
        <meta property="og:title" content="PIYE TO KIH? THE MOVIE - Official Website Film Bioskop" />
        <meta
          property="og:description"
          content="Official website resmi film komedi bioskop PIYE TO KIH? THE MOVIE produksi Miracle Pictures. Karya Sutradara Ito Mavin, tayang serentak di bioskop mulai 19 November 2026. Lulus Sensor LSF 13+."
        />
        <meta property="og:image" content="https://piyetokihfilm.com/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://piyetokihfilm.com/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="PIYE TO KIH? THE MOVIE - Miracle Pictures" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PIYE TO KIH? THE MOVIE - Official Website Film Bioskop" />
        <meta
          name="twitter:description"
          content="Official website resmi film komedi bioskop PIYE TO KIH? THE MOVIE produksi Miracle Pictures. Tayang serentak di bioskop mulai 19 November 2026."
        />
        <meta name="twitter:image" content="https://piyetokihfilm.com/og-image.jpg" />
      </head>
      <body className="antialiased bg-[#0B0F17] text-white selection:bg-gold-500 selection:text-black">
        <MetaPixelTracker
          pixelId={db.settings.metaPixelId}
          tiktokPixelId={db.settings.tiktokPixelId}
          googleAnalyticsId={db.settings.googleAnalyticsId}
        />

        {/* Banner Khusus Admin saat Mode Coming Soon Aktif (HANYA DITAMPILKAN KE ADMIN YANG SAH) */}
        {isMaintenanceMode && isAdmin && (
          <AdminMaintenanceBanner isMaintenanceMode={true} />
        )}

        {/* Cinematic Clean Header (Hanya tampil di publik jika TIDAK dalam mode Coming Soon, atau jika Admin) */}
        {!showComingSoon && <PublicHeader showHeader={true} />}

        {/* Main Content: Tampilkan Coming Soon untuk seluruh rute publik jika mode Coming Soon aktif */}
        <main className="min-h-screen">
          {showComingSoon ? (
            <ComingSoonView
              headline={db.settings.maintenanceHeadline}
              subtitle={db.settings.maintenanceSubtitle}
              socialLinks={db.settings.socialLinks}
            />
          ) : (
            children
          )}
        </main>

        {/* Floating WhatsApp AI CS Widget (Mas Kidi - Universal Fast Track) */}
        <FloatingWhatsAppWidget
          whatsappNumber={
            db.settings.wahnotifSenderNumber ||
            db.settings.kabarGaleriSettings?.mediaKitContactWa ||
            '6285691921764'
          }
        />
      </body>
    </html>
  );
}
