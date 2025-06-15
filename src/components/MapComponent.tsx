// components/MapComponent.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { baseUrlStock } from "@/components/BaseURL";

export default function MapComponent({ busId }: { busId: string }) {
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [employeePosition, setEmployeePosition] = useState<
    [number, number] | null
  >(null);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const employeeMarkerRef = useRef<L.Marker | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  // Setup Leaflet marker icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  // Get employee's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setEmployeePosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        error => {
          console.error("Geolocation error:", error);
          setEmployeePosition([30.0444, 31.2357]); // fallback to Cairo
        },
      );
    } else {
      console.error("Geolocation not supported");
      setEmployeePosition([30.0444, 31.2357]); // fallback
    }
  }, []);

  // Initialize the map when employee's location is available
  useEffect(() => {
    if (!employeePosition) return;

    const map = L.map("map").setView(employeePosition, 10);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add employee marker
    employeeMarkerRef.current = L.marker(employeePosition)
      .addTo(map)
      .bindPopup("Employee")
      .openPopup();

    return () => {
      map.remove();
    };
  }, [employeePosition]);

  // Auto-connect when bus ID is entered and location is available
  useEffect(() => {
    if (busId && !connected && !isConnecting && employeePosition) {
      connect();
    }
  }, [busId, employeePosition]);

  const connect = () => {
    if (!busId || connected || isConnecting || !employeePosition) return;

    setIsConnecting(true);
    const token = Cookies.get("token");

    const client = new Client({
      brokerURL: `${baseUrlStock}ws?token=${token}`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: str => console.log(str),
    });

    client.onConnect = () => {
      console.log("WebSocket Connected");
      setConnected(true);
      setIsConnecting(false);

      client.subscribe(`/topic/bus-location/${busId}`, message => {
        const data = JSON.parse(message.body);
        const { latitude, longitude } = data.data;
        const driverLatLng: [number, number] = [latitude, longitude];

        // Update or create driver marker
        if (markerRef.current) {
          markerRef.current.setLatLng(driverLatLng);
        } else {
          markerRef.current = L.marker(driverLatLng)
            .addTo(mapRef.current!)
            .bindPopup("Driver")
            .openPopup();
        }

        // Update or create polyline route
        if (routeRef.current) {
          routeRef.current.setLatLngs([employeePosition, driverLatLng]);
        } else {
          routeRef.current = L.polyline([employeePosition, driverLatLng], {
            color: "blue",
            weight: 4,
            dashArray: "5,10",
          }).addTo(mapRef.current!);
        }

        mapRef.current?.setView(driverLatLng);
      });
    };

    client.onStompError = () => {
      setIsConnecting(false);
      console.error("WebSocket connection error");
    };

    client.activate();
    stompClientRef.current = client;
  };

  const disconnect = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (routeRef.current) {
      routeRef.current.remove();
      routeRef.current = null;
    }
    setConnected(false);
    setIsConnecting(false);
  };

  return (
    <div className="h-[calc(100vh-220px)] w-full overflow-hidden rounded-md shadow">
      <div id="map" className="h-full w-full" />
    </div>
  );
}
