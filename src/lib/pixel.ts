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

export function trackCityCustomEvent(city: string, action: string = 'AddToCart', params: Record<string, any> = {}) {
  if (!city) return;
  const cleanCity = city.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    // 1. Format: AddToCart_Semarang / AddToCart_Yogyakarta
    window.fbq('trackCustom', `${action}_${cleanCity}`, {
      city,
      action,
      ...params,
    });

    // 2. Format: AddToCart Semarang (dengan spasi)
    window.fbq('trackCustom', `${action} ${city.trim()}`, {
      city,
      action,
      ...params,
    });

    // 3. Format khusus Meet & Greet per kota
    window.fbq('trackCustom', `MeetAndGreet_${cleanCity}`, {
      city,
      ...params,
    });
  }

  logVisitorEvent(`${action}_${cleanCity}`, { city, ...params });
}

export function trackTicketIntent(city: string, cinema: string, url: string, price: number = 35000) {
  // 1. Meta Standard Event: AddToCart
  trackMetaEvent('AddToCart', {
    content_name: `Tiket Bioskop ${cinema} - ${city}`,
    content_category: 'Movie Ticket',
    content_ids: [`ticket-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`],
    content_type: 'product',
    value: price,
    currency: 'IDR',
    cinema: cinema,
    city: city,
    destination_url: url,
  });

  // 2. Meta Standard Event: InitiateCheckout
  trackMetaEvent('InitiateCheckout', {
    content_name: `Beli Tiket ${cinema} (${city})`,
    content_category: 'Cinema Ticketing',
    value: price,
    currency: 'IDR',
    destination_url: url,
  });

  // 3. Custom Pixel Per Kota (contoh: AddToCart_Semarang, AddToCart Semarang, MeetAndGreet_Semarang)
  trackCityCustomEvent(city, 'AddToCart', {
    cinema,
    url,
    price,
  });

  // 4. Custom Event untuk Internal Analytics Dashboard
  trackMetaEvent('TicketIntent', {
    content_name: `Tiket ${cinema}`,
    content_category: 'Cinema Ticketing',
    city: city,
    cinema: cinema,
    destination_url: url,
  });
}

export function trackLeadSubmission(serialNumber: string, city: string = '') {
  trackMetaEvent('Lead', {
    content_name: 'War Voucher Claim',
    voucher_code: serialNumber,
    city: city || undefined,
    value: 1,
    currency: 'IDR',
  });

  if (city) {
    trackCityCustomEvent(city, 'Lead', {
      voucher_code: serialNumber,
    });
  }
}
