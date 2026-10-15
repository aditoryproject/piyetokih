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
  title: 'PIYE TO KIH? - Official Movie & War Voucher',
  description: 'Landing page resmi film komedi bioskop Piye Toh Kih oleh Miracle Pictures. Klaim War Voucher spesial penayangan bioskop!',
  keywords: 'Piye To Kih, Miracle Pictures, Film Bioskop, War Voucher, Tiket Bioskop',
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
        {db.settings.metaPixelId && (
          <>
            <script
              id="meta-pixel-base"
              dangerouslySetInnerHTML={{
                __html: `
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
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${db.settings.metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {db.settings.tiktokPixelId && (
          <script
            id="tiktok-pixel-base"
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
                  ttq.load('${db.settings.tiktokPixelId}');
                  ttq.page();
                }(window, document, 'ttq');
              `,
            }}
          />
        )}
        {db.settings.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${db.settings.googleAnalyticsId}`} />
            <script
              id="ga4-base"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${db.settings.googleAnalyticsId}');
                `,
              }}
            />
          </>
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
