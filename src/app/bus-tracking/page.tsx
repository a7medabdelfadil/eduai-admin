// pages/bus-tracking.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Container from "@/components/Container";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function BusTrackingPage() {
  const [busId, setBusId] = useState("");

  return (
    <Container>
      <div className="space-y-4 rounded bg-bgPrimary p-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Enter Bus ID"
            value={busId}
            onChange={e => setBusId(e.target.value)}
            className="w-1/3 bg-bgPrimary rounded-md border border-borderPrimary p-2"
          />
        </div>
        <MapComponent busId={busId} />
      </div>
    </Container>
  );
}
