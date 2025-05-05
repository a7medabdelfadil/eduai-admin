// pages/bus-tracking.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Container from '@/components/Container';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
});

export default function BusTrackingPage() {
  const [busId, setBusId] = useState('');

  return (
    <Container>
      <div className="p-4 space-y-4 bg-bgPrimary rounded">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Enter Bus ID"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            className="border rounded-md p-2 w-1/3"
          />
        </div>
        <MapComponent busId={busId} />
      </div>
    </Container>
  );
}
