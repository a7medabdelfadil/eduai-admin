"use client";
import { useGetChatMessagesQuery } from "@/features/chat/chatApi";
import { RootState } from "@/GlobalRedux/store";
import { Client, IMessage } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Message {
  chatId: number | string;
  id: number | string;
  content: string;
  creationTime: string;
  creatorName: string;
  imageUrl?: string;
}

interface ChatPageProps {
  userId: string | null;
  regetusers: () => void;
  userName: string;
}

const ChatPage = ({ userId, regetusers, userName }: ChatPageProps) => {

  function extractDayNameMonthName(datetimeString: string): string {
    const date = new Date(datetimeString);

    // Arrays of day and month names
    const dayNames = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Extracting day name and month name
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    // Extracting day of the month
    const day = String(date.getDate()).padStart(2, '0');

    // Extracting time part from the datetime string
    const timePart = datetimeString.split('T')[1].split('.')[0]; // Handles possible milliseconds

    // Constructing the result string
    return `${dayName}, ${monthName} ${day} ${timePart}`;
}

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const token = Cookies.get("token");
  const { data: messagesData, isLoading, error } = useGetChatMessagesQuery(
    userId!,
    {
      skip: userId === null,
    }
  );

  // Get current user's username from Redux store
  const currentUserName = useSelector(
    (state: RootState) => state.user.name || "Unknown User"
  );

  // WebSocket connection reference
  const stompClientRef = useRef<Client | null>(null);

  // Initialize messages from fetched data
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  // Establish WebSocket connection
  useEffect(() => {
    // Validate token and userId before connection
    if (!token || !userId) {
      toast.error("Authentication required to start chat");
      return;
    }

    // Create STOMP client
    const stompClient = new Client({
      brokerURL: `wss://eduai.vitaparapharma.com/ws?token=${token}`,
      debug: function (str) {
        console.log("[STOMP Debug]", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Connection success handler
    stompClient.onConnect = () => {
      console.log("WebSocket Connected Successfully");

      // Subscribe to user-specific chat channel
      stompClient.subscribe(`/direct-chat/${userId}`, (message: IMessage) => {
        try {
          const newMessage: Message = JSON.parse(message.body);
          
          // Add message using functional update to ensure no duplicates
          setMessages((prevMessages) => {
            // Check if message already exists by its unique identifier
            const messageExists = prevMessages.some(
              (msg) => msg.id === newMessage.id
            );
            
            // Only add if not already in the list
            return messageExists 
              ? prevMessages 
              : [...prevMessages, newMessage];
          });
        } catch (parseError) {
          console.error("Error parsing incoming message:", parseError);
        }
      });
    };

    // Error handling
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Details:", frame.body);
      toast.error("Chat connection error");
    };

    stompClient.onWebSocketError = (event) => {
      console.error("WebSocket connection error:", event);
      toast.error("Unable to establish chat connection");
    };

    // Activate the connection
    stompClient.activate();
    stompClientRef.current = stompClient;

    // Cleanup on component unmount
    return () => {
      stompClient.deactivate();
      stompClientRef.current = null;
    };
  }, [token, userId]);

  // Image file handler
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Optional: Add file size and type validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (file.size > maxSize) {
        toast.error("File too large. Max 5MB allowed.");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error("Unsupported file type. Use JPEG, PNG, or GIF.");
        return;
      }

      setImageFile(file);
    }
  };

  // Message sending handler
  const handleSendMessage = async () => {
    // Validate message or image
    if (!input.trim() && !imageFile) {
      toast.error("Cannot send empty message");
      return;
    }

    // Check WebSocket connection
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      toast.error("Chat connection lost. Please reconnect.");
      return;
    }

    // Prepare message payload
    const messagePayload = {
      chatId: userId,
      content: input.trim(),
      ...(imageFile ? { imageUrl: URL.createObjectURL(imageFile) } : {})
    };

    try {
      // Publish message via WebSocket
      stompClientRef.current.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(messagePayload),
      });

      // Trigger users refresh
      regetusers();

      // Reset input states
      setInput("");
      setImageFile(null);

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Message sending failed:", error);
      toast.error("Failed to send message");
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="mx-auto flex h-[700px] w-full flex-col rounded-xl bg-bgPrimary">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto break-words rounded-xl bg-bgPrimary p-4">
        {isLoading && <p></p>}
        {error && <p>Error loading messages</p>}
        {messages.map((msg, idx) => (
          <div
            key={`${msg.id}-${idx}`}
            className={`mb-4 grid w-[320px] rounded-lg p-3 font-semibold text-balance break-words ${
              msg.creatorName !== currentUserName
                ? "mr-auto bg-[#5570f1] text-left text-white"
                : "ml-auto bg-chat text-right text-black"
            }`}
          >
            <p className="font-light text-gray-800">
              {msg.creatorName !== currentUserName ? `${userName}` : `${currentUserName}`}
            </p>
            <p className="break-words w-[300px]">{msg.content}</p>
            <p className="break-words text-sm text-start font-light text-gray-800">{extractDayNameMonthName(msg.creationTime)}</p>
            {msg.imageUrl && (
              <img 
                src={msg.imageUrl} 
                alt="Attached" 
                className="mt-2 max-w-full rounded-lg" 
              />
            )}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input, Image Upload, and Send button */}
      <div className="m-4 flex items-center justify-between gap-5 rounded-xl border border-borderPrimary bg-bgPrimary px-4 py-1">
        <div className="grid items-center justify-center">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <svg
              className="h-6 w-6 cursor-pointer"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </label>
          {imageFile && (
            <p className="mt-2 text-nowrap text-sm text-gray-700">
              {imageFile.name}
            </p>
          )}
        </div>

        <input
          type="text"
          className="flex-1 rounded-lg p-2 focus:outline-none"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button
          className="ml-4 flex items-center gap-3 rounded-lg bg-[#ffead1] px-2 py-1 font-semibold text-black hover:bg-[#dfbd90]"
          onClick={handleSendMessage}
        >
          Send
          <svg
            className="h-5 w-5 text-black"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="10" y1="14" x2="21" y2="3" />{" "}
            <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
