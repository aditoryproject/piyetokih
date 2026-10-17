import type { Metadata } from 'next';
import './globals.css';
import { cookies, headers } from 'next/headers';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { getDb } from '@/lib/db';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import AdminMaintenanceBanner from '@/components/AdminMaintenanceBanner';
import PublicHeader from '@/components/PublicHeader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const cookieStore = await cookies();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isAdmin = session.valid;

  const db = getDb();
  const isMaintenanceMode = Boolean(db.settings.isMaintenanceMode);

  // If path is under /admin, we don't render the public header
  const isAdminPath = pathname.startsWith('/admin') || pathname.includes('/admin');
  const showHeader = (!isMaintenanceMode || isAdmin) && !isAdminPath;

  return (
    <html lang="id">
      <head>
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

        {/* Non-blocking Analytics & Pixels (Loaded after initial paint to prevent TBT delay) */}
        {db.settings.metaPixelId && (
          <script
            id="meta-pixel-base"
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f.fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${db.settings.metaPixelId}');
                    fbq('track', 'PageView');
                  }, 100);
                });
              `,
            }}
          />
        )}
        {db.settings.tiktokPixelId && (
          <script
            id="tiktok-pixel-base"
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    !function (w, d, t) {
                      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
                      ttq.load('${db.settings.tiktokPixelId}');
                      ttq.page();
                    }(window, document, 'ttq');
                  }, 200);
                });
              `,
            }}
          />
        )}
        {db.settings.googleAnalyticsId && (
          <script
            id="ga4-base"
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('load', function() {
                  var s = document.createElement('script');
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=${db.settings.googleAnalyticsId}';
                  s.async = true;
                  document.head.appendChild(s);
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${db.settings.googleAnalyticsId}');
                });
              `,
            }}
          />
        )}
      </head>
      <body className="antialiased bg-[#0B0F17] text-white selection:bg-gold-500 selection:text-black">
        <MetaPixelTracker />

        {/* Banner Khusus Admin saat Mode Coming Soon Aktif */}
        {isAdmin && isMaintenanceMode && !isAdminPath && (
          <AdminMaintenanceBanner isMaintenanceMode={true} />
        )}

        {/* Cinematic Clean Header (Hanya tampil di halaman publik, tidak pernah di /admin) */}
        <PublicHeader showHeader={showHeader} />

        {/* Main Content: Selalu render children agar tidak ada rute/halaman yang terblokir */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
