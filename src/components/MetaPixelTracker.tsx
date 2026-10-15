'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface MetaPixelTrackerProps {
  pixelId?: string;
  tiktokPixelId?: string;
  googleAnalyticsId?: string;
}

export default function MetaPixelTracker({
  pixelId: initialPixelId,
  tiktokPixelId: initialTikTokId,
  googleAnalyticsId: initialGaId,
}: MetaPixelTrackerProps) {
  const [pixelId, setPixelId] = useState<string>(
    initialPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || ''
  );
  const [tiktokPixelId, setTiktokPixelId] = useState<string>(
    initialTikTokId || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || ''
  );
  const [gaId, setGaId] = useState<string>(
    initialGaId || process.env.NEXT_PUBLIC_GA_ID || ''
  );

  const pathname = usePathname();

  // Sinkronisasi data pixel jika ada update dari admin dashboard
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.metaPixelId) {
          setPixelId(data.settings.metaPixelId);
        }
        if (data.settings?.tiktokPixelId) {
          setTiktokPixelId(data.settings.tiktokPixelId);
        }
        if (data.settings?.googleAnalyticsId) {
          setGaId(data.settings.googleAnalyticsId);
        }
      })
      .catch(() => {});
  }, []);

  // Track PageView pada setiap perpindahan route / halaman di Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'PageView');
      }
      if (typeof (window as any).ttq?.page === 'function') {
        (window as any).ttq.page();
      }
      if (typeof (window as any).gtag === 'function' && gaId) {
        (window as any).gtag('config', gaId, { page_path: pathname });
      }

      // Log ke analytics internal database
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'PageView',
            path: pathname || window.location.pathname || '/',
          }),
        }).catch(() => {});
      } catch {}
    }
  }, [pathname, gaId]);

  return (
    <>
      {/* 1. META PIXEL (FACEBOOK / INSTAGRAM ADS) - DIRECT INLINE SCRIPT UNTUK METATAG/HELPER INSTANT DETECT */}
      {pixelId && (
        <>
          <script
            id="fb-pixel"
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
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* 2. TIKTOK PIXEL (OPTIONAL) */}
      {tiktokPixelId && (
        <script
          id="tiktok-pixel"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
                ttq.load('${tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* 3. GOOGLE ANALYTICS (GA4 - OPTIONAL) */}
      {gaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
        </>
      )}
    </>
  );
}
