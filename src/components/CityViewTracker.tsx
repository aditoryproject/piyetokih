'use client';

import { useEffect } from 'react';
import { trackMetaEvent, trackCityCustomEvent } from '@/lib/pixel';

interface CityViewTrackerProps {
  cityName: string;
  slug: string;
}

export default function CityViewTracker({ cityName, slug }: CityViewTrackerProps) {
  useEffect(() => {
    // 1. Meta Standard Event: ViewContent per kota
    trackMetaEvent('ViewContent', {
      content_name: `Roadshow Kota ${cityName}`,
      content_category: 'City Roadshow',
      content_ids: [`city-${slug}`],
      city: cityName,
    });

    // 2. Custom Event per kota (untuk retargeting per kota di Meta Ads)
    trackCityCustomEvent(cityName, 'ViewCity', {
      city: cityName,
      slug,
    });
  }, [cityName, slug]);

  return null;
}
