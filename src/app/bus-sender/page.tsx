/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Client, Frame } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { baseUrlStock } from "@/components/BaseURL";

interface FormData {
  busId: string;
}

const DriverLocationSender: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ busId: "" });
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [status, setStatus] = useState("Disconnected");

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token || !formData.busId) return;

    const client = new Client({
      brokerURL: `${baseUrlStock}ws?token=${token}`,
      debug: (str: string) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame: Frame) => {
      setConnected(true);
      setStatus("Connected to WebSocket");
      console.log("✅ Connected:", frame);
    };

    client.onStompError = (frame: Frame) => {
      console.error("❌ STOMP Error:", frame.headers.message, frame.body);
      setStatus("STOMP error occurred");
    };

    client.onWebSocketError = (event: Event) => {
      console.error("WebSocket error:", event);
      setStatus("WebSocket error");
    };

    setStompClient(client);

    return () => {
      if (client.connected) void client.deactivate();
    };
  }, [formData.busId, token]);

  // تفعيل الاتصال
  const connect = useCallback(() => {
    if (stompClient) {
      stompClient.activate();
    }
  }, [stompClient]);

  // قطع الاتصال
  const disconnect = useCallback(() => {
    if (stompClient) {
      void stompClient.deactivate();
      setConnected(false);
      setSending(false);
      setStatus("Disconnected");
    }
  }, [stompClient]);

  useEffect(() => {
    if (!connected || !sending || !formData.busId || !stompClient) return;

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const data = {
              busId: parseInt(formData.busId),
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            stompClient.publish({
              destination: "/app/update-location",
              body: JSON.stringify(data),
            });

            console.log("📤 Location sent:", data);
          },
          (err) => console.error("GPS Error:", err),
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connected, sending, formData.busId, stompClient]);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-blue-700">
        🚍 Driver Location Sender
      </h1>

      <input
        type="text"
        id="busId"
        className="mb-4 w-full rounded border p-2"
        placeholder="Enter Bus ID"
        value={formData.busId}
        onChange={(e) =>
          setFormData({ ...formData, busId: e.target.value })
        }
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={connect}
          disabled={connected}
          className={`rounded px-4 py-2 font-semibold text-white ${
            connected
              ? "bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Connect
        </button>

        <button
          onClick={disconnect}
          disabled={!connected}
          className={`rounded px-4 py-2 font-semibold text-white ${
            !connected
              ? "bg-gray-400"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Disconnect
        </button>

        <button
          onClick={() => setSending(!sending)}
          disabled={!connected}
          className={`rounded px-4 py-2 font-semibold text-white ${
            !connected
              ? "bg-gray-400"
              : sending
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {sending ? "Stop Sending" : "Start Sending"}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-700">Status: {status}</p>
      </div>
    </div>
  );
};

export default DriverLocationSender;
