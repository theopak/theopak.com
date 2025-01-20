'use client';

import { useEffect, useState } from 'react';
import { LoadingDots } from './LoadingDots';

const formatNumber = new Intl.NumberFormat('en-us').format;

export function VisitsCounter() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const prev = parseInt(localStorage.getItem('visits') || '', 10) || 0;
      const value = prev + 1;
      setVisits(value);
      localStorage.setItem('visits', value.toString());
    } else {
      setVisits(1);
    }
  }, []);

  return visits ? formatNumber(visits) : <LoadingDots />;
}
