'use client';

import { useEffect, useState } from 'react';

const formatNumber = new Intl.NumberFormat('en-us').format;

export function VisitsCounter() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    if (typeof localStorage !== 'undefined' && visits) {
      localStorage.setItem('visits', visits.toString());
    }
  }, [visits]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const prev = parseInt(localStorage.getItem('visits'), 10) || 0;
      setVisits(prev + 1);
    }
  }, []);

  return visits ? formatNumber(visits) : '…';
}
