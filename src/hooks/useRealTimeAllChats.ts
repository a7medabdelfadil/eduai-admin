import { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { baseUrlStock } from '@/components/BaseURL';

interface ChatUpdate {
  chatId: string;
  targetUser: {
    id: string;
    name: string;
    Role: string;
    hasPhoto: boolean;
    photoLink?: string;
  };
  lastMessage: string;
  numberOfNewMessages: number;
}

interface UseChatListSocketResult {
  isConnected: boolean;
  reconnect: () => void;
}

export const useChatListSocket = (
  userId: string | null,
  onChatUpdate: (update: ChatUpdate) => void
): UseChatListSocketResult => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttempts = useRef(0);
  
  // Setup and manage WebSocket connection
  const setupConnection = useEffect(() => {
    const token = Cookies.get('token');
    if (!token || !userId) {
      setIsConnected(false);
      return;
    }

    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Create new STOMP client
    const stompClient = new Client({
      brokerURL: `${baseUrlStock}ws?token=${token}`,
      debug: function (str) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[STOMP Chat List Debug]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Connection successful handler
    stompClient.onConnect = () => {
      console.log('WebSocket Chat List Connected Successfully');
      setIsConnected(true);
      connectionAttempts.current = 0;

      // Subscribe to chat list updates
      stompClient.subscribe(`/user/${userId}/chat-updates`, (message: IMessage) => {
        try {
          const chatUpdate: ChatUpdate = JSON.parse(message.body);
          console.log("Received chat update:", chatUpdate);
          onChatUpdate(chatUpdate);
        } catch (parseError) {
          console.error('Error parsing chat update:', parseError);
        }
      });
      
      // Subscribe to new message notifications (separate from chat updates)
      stompClient.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
        try {
          const messageData = JSON.parse(message.body);
          console.log("Received new message notification:", messageData);
          
          // Create a chat update from the message data
          const chatUpdate: ChatUpdate = {
            chatId: messageData.chatId,
            lastMessage: messageData.content || messageData.text || "New message",
            numberOfNewMessages: 1,
            targetUser: messageData.sender || {
              id: messageData.senderId,
              name: messageData.senderName || "User",
              Role: messageData.senderRole || "",
              hasPhoto: !!messageData.senderPhotoLink,
              photoLink: messageData.senderPhotoLink
            }
          };
          
          // Process it like a regular chat update
          onChatUpdate(chatUpdate);
        } catch (parseError) {
          console.error('Error parsing message notification:', parseError);
        }
      });
      
      // Subscribe to general notifications if needed
      stompClient.subscribe('/topic/notifications', (message: IMessage) => {
        try {
          const notification = JSON.parse(message.body);
          console.log('Received notification:', notification);
          // Handle global notifications here if needed
        } catch (parseError) {
          console.error('Error parsing notification:', parseError);
        }
      });
    };

    // Error handlers
    stompClient.onStompError = frame => {
      console.error('Broker reported chat list error:', frame.headers['message']);
      console.error('Details:', frame.body);
      setIsConnected(false);
      scheduleReconnect();
    };

    stompClient.onWebSocketError = event => {
      console.error('WebSocket chat list connection error:', event);
      setIsConnected(false);
      scheduleReconnect();
    };

    stompClient.onWebSocketClose = () => {
      console.log('WebSocket chat list connection closed');
      setIsConnected(false);
      scheduleReconnect();
    };

    // Schedule reconnection with exponential backoff
    const scheduleReconnect = () => {
      if (connectionAttempts.current < 5) {
        const delay = Math.min(30000, 1000 * Math.pow(2, connectionAttempts.current));
        console.log(`Scheduling reconnect attempt in ${delay}ms`);
        
        connectionAttempts.current++;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect chat list WebSocket...');
          if (stompClientRef.current) {
            stompClientRef.current.activate();
          }
        }, delay);
      } else {
        console.log('Max reconnection attempts reached. Please refresh the page.');
      }
    };

    // Activate the connection
    stompClient.activate();
    stompClientRef.current = stompClient;

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      
      setIsConnected(false);
    };
  }, [userId, onChatUpdate]);

  // Manual reconnect function
  const reconnect = () => {
    if (stompClientRef.current) {
      connectionAttempts.current = 0;
      stompClientRef.current.deactivate();
      
      setTimeout(() => {
        if (stompClientRef.current) {
          stompClientRef.current.activate();
        }
      }, 1000);
    }
  };

  // Handle token refresh - reconnect when token changes
  useEffect(() => {
    const handleTokenChange = () => {
      const newToken = Cookies.get('token');
      if (newToken && stompClientRef.current) {
        reconnect();
      }
    };

    // Listen for token changes (custom event that should be dispatched when token refreshes)
    window.addEventListener('token-refreshed', handleTokenChange);
    
    return () => {
      window.removeEventListener('token-refreshed', handleTokenChange);
    };
  }, []);

  // Automatically try to reconnect if connection is lost when document becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && stompClientRef.current) {
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected]);

  return {
    isConnected,
    reconnect
  };
};
