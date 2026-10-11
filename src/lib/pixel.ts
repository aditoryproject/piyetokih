'use client';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function logVisitorEvent(event: string, meta: Record<string, any> = {}) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        meta,
      }),
    }).catch(() => {});
  } catch {}
}

export function trackMetaEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
  logVisitorEvent(eventName, params);
}

export function trackTicketIntent(city: string, cinema: string, url: string) {
  trackMetaEvent('TicketIntent', {
    content_name: `Tiket ${cinema}`,
    content_category: 'Cinema Ticketing',
    city: city,
    cinema: cinema,
    destination_url: url,
  });
}

export function trackLeadSubmission(serialNumber: string) {
  trackMetaEvent('Lead', {
    content_name: 'War Voucher Claim',
    voucher_code: serialNumber,
    value: 1,
    currency: 'IDR',
  });
}
