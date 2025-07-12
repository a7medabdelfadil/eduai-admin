import { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { baseUrlStock } from "@/components/BaseURL";

interface NotificationsHookResult {
  notificationsCount: number;
  isConnected: boolean;
}

export const useNotificationsWebSocket = (
  userId: string | null,
): NotificationsHookResult => {
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousCountRef = useRef<number>(0);
  const connectedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notifi.mp3");
    audioRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token || !userId) return;

    const stompClient = new Client({
      webSocketFactory: () => new WebSocket(`${baseUrlStock}ws?token=${token}`),
      reconnectDelay: 3000,
      connectionTimeout: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("[STOMP Debug]", str),
    });

    stompClient.onConnect = () => {
      console.log("✅ Connected to notifications-count");
      setIsConnected(true);
      connectedRef.current = true;

      stompClient.subscribe(
        `/user/${userId}/notifications-count`,
        (message: IMessage) => {
          try {
            const count = parseInt(message.body, 10);
            if (count > previousCountRef.current && audioRef.current) {
              audioRef.current.play().catch((err) => {
                console.error("🔇 Failed to play sound:", err);
              });
            }
            setNotificationsCount(Math.max(0, count));
            previousCountRef.current = count;
            window.dispatchEvent(new Event("new-notification"));
          } catch (error) {
            console.error("❌ Failed to parse notifications count:", error);
          }
        },
      );
    };

    stompClient.onStompError = (frame) => {
      console.error("⛔ STOMP error:", frame.headers["message"]);
      console.error("Details:", frame.body);
      setIsConnected(false);
    };

    stompClient.onWebSocketError = (event) => {
      console.error("🛑 WebSocket error:", event);
      setIsConnected(false);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      stompClientRef.current = null;
      connectedRef.current = false;
      setIsConnected(false);
    };
  }, [userId]);

  // ✅ هذه useEffect خارجية لإعادة المحاولة
  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectedRef.current && stompClientRef.current && !stompClientRef.current.active) {
        console.log("🔁 Trying to reconnect...");
        stompClientRef.current.activate();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    notificationsCount,
    isConnected,
  };
};
