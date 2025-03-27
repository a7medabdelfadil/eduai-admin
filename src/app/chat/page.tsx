"use client";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";

interface ChatData {
  chatId: string;
  lastMessage: string;
  numberOfNewMessages: number;
  targetUser: {
    id: string;
    name: string;
    Role: string;
    hasPhoto?: boolean;
    photoLink?: string;
  };
}
import Modal from "@/components/model";
import SearchableSelect from "@/components/select";
import Spinner from "@/components/spinner";
import { useGetAllUsersChatQuery } from "@/features/User-Management/teacherApi";
import {
  useCreateNewChatMutation,
  useDeleteChatMutation,
  useGetAllChatsQuery,
} from "@/features/chat/chatApi";
import { useChatListSocket } from "@/hooks/useRealTimeAllChats";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ChatPage = dynamic(() => import("@/components/chat"), { ssr: false });
const Chat = () => {
  const breadcrumbs = [
    {
      nameEn: "Communication",
      nameAr: "التواصل",
      nameFr: "Communication",
      href: "/",
    },
    {
      nameEn: "Reported Chat",
      nameAr: "دردشة",
      nameFr: "Discussion signalée",
      href: "/chat",
    },
  ];

  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [realUserId, setRealUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [createChat] = useCreateNewChatMutation();
  const { data: users, isLoading: isGetting } = useGetAllUsersChatQuery(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState("");
  const optionsRigon =
    users?.data?.content.map((user: { Role: any; id: any; name: any }) => ({
      value: user.id,
      label: `${user.name} - ${user.Role}`,
    })) || [];
  const { data, isLoading, refetch: regetusers } = useGetAllChatsQuery(null);
  const [deleteChat] = useDeleteChatMutation();

  const [localChats, setLocalChats] = useState<ChatData[]>([]);
  const currentUserId =
    useSelector((state: RootState) => state.user?.id) || null;

  // Keep track of if this is first load
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (data?.data?.content) {
      if (isInitialMount.current) {
        // On first load, set local chats directly
        setLocalChats(data.data.content);
        isInitialMount.current = false;
      } else {
        // On subsequent loads, merge with existing chats preserving read/unread status
        setLocalChats(prevChats => {
          const updatedChats = [...data.data.content];

          // Preserve numberOfNewMessages for chats that aren't the active one
          return updatedChats.map(newChat => {
            if (newChat.chatId === userId) {
              // Reset counters for the active chat
              return { ...newChat, numberOfNewMessages: 0 };
            }

            // For other chats, find matching chat in previous state and preserve count
            const existingChat = prevChats.find(
              chat => chat.chatId === newChat.chatId,
            );
            if (existingChat) {
              return {
                ...newChat,
                numberOfNewMessages: existingChat.numberOfNewMessages,
              };
            }

            return newChat;
          });
        });
      }
    }
  }, [data, userId]);

  const handleChatUpdate = useCallback(
    (update: ChatData) => {
      console.log("Processing chat update:", update);

      setLocalChats((prevChats: ChatData[]) => {
        // Check if this is an update for the currently active chat
        const isActiveChat = update.chatId === userId;

        // Find if the chat already exists
        const existingChatIndex = prevChats.findIndex(
          chat => chat.chatId === update.chatId,
        );

        // Create a new array for immutability
        const updatedChats = [...prevChats];

        if (existingChatIndex === -1) {
          // It's a new chat, add it to the beginning
          console.log("Adding new chat to list:", update.chatId);
          return [
            {
              ...update,
              // If it's the active chat, don't show new message indicators
              numberOfNewMessages: isActiveChat
                ? 0
                : update.numberOfNewMessages || 1,
            },
            ...prevChats,
          ];
        }

        // Update existing chat
        console.log(
          "Updating existing chat:",
          update.chatId,
          "Active:",
          isActiveChat,
        );
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          lastMessage:
            update.lastMessage || updatedChats[existingChatIndex].lastMessage,
          // If it's the active chat, don't increment the counter
          numberOfNewMessages: isActiveChat
            ? 0
            : (updatedChats[existingChatIndex].numberOfNewMessages || 0) +
              (update.numberOfNewMessages || 1),
          targetUser: {
            ...updatedChats[existingChatIndex].targetUser,
            ...(update.targetUser || {}),
          },
        };

        // Always move the updated chat to the top (even if it's the current chat)
        if (existingChatIndex > 0) {
          const chatToMove = updatedChats.splice(existingChatIndex, 1)[0];
          updatedChats.unshift(chatToMove);
        }

        console.log(
          "Updated chats:",
          updatedChats.map(c => c.chatId),
        );
        return updatedChats;
      });
    },
    [userId],
  );

  const clearNewMessages = useCallback((chatId: string) => {
    setLocalChats((prevChats: ChatData[]) =>
      prevChats.map((chat: ChatData) =>
        chat.chatId === chatId ? { ...chat, numberOfNewMessages: 0 } : chat,
      ),
    );
  }, []);

  // Effect to clear new messages when a chat is selected
  useEffect(() => {
    if (userId) {
      clearNewMessages(userId);
    }
  }, [userId, clearNewMessages]);

  const { isConnected } = useChatListSocket(currentUserId, handleChatUpdate);

  // Update connection status indicator
  useEffect(() => {
    if (isConnected) {
      // You could add a visual indicator or log for connection status
      console.log("Real-time chat connection established");
    } else {
      console.log("Real-time chat connection disconnected");
    }
  }, [isConnected]);

  const handleDelete = async (id: string) => {
    try {
      await deleteChat(id).unwrap();
      toast.success(`Chat with ID ${id} deleted successfully`);
      // Remove from local state immediately for better UX
      setLocalChats(prevChats => prevChats.filter(chat => chat.chatId !== id));

      // If the deleted chat was the active one, clear the active chat
      if (userId === id) {
        setUserId("");
        setUserName("");
        setUserRole("");
        setRealUserId("");
      }

      regetusers();
    } catch (err) {
      toast.error("Failed to delete the chat");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const result = await createChat(data).unwrap();
      setModalOpen(false);
      toast.success("Chat created successfully");

      // Add the new chat to local state immediately
      if (result?.data) {
        handleChatUpdate({
          chatId: result.data.chatId,
          lastMessage: "Chat started",
          numberOfNewMessages: 0,
          targetUser: result.data.targetUser,
        });

        // Auto-select the new chat
        setUserId(result.data.chatId);
        setUserName(result.data.targetUser.name);
        setUserRole(result.data.targetUser.Role);
        setRealUserId(result.data.targetUser.id);
      }

      regetusers();
    } catch (err) {
      toast.error("Failed to create chat");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleOpenModal2 = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the chat selection
    setSelectedChatId(chatId);
    setModalOpen2(true);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleCloseModal = () => {
    setModalOpen(false);
    reset(); // Clear form on modal close
  };

  const handleCloseModal2 = () => {
    setModalOpen2(false);
    setSelectedChatId("");
  };

  const handleChatClick = (chat: ChatData) => {
    setUserId(chat.chatId);
    setUserName(chat.targetUser.name);
    setUserRole(chat.targetUser.Role);
    setRealUserId(chat.targetUser.id);
    clearNewMessages(chat.chatId);
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  const getTranslation = (en: string, ar: string, fr: string) => {
    switch (currentLanguage) {
      case "en":
        return en;
      case "ar":
        return ar;
      case "fr":
        return fr;
      default:
        return en;
    }
  };

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={` ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } mt-10`}
      >
        <div
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          className="flex w-full justify-between gap-10 rounded-lg p-4 max-[1180px]:grid max-[1180px]:justify-center"
        >
          <div className="h-[700px] w-full overflow-y-auto rounded-xl bg-bgPrimary p-5">
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <div className="flex justify-between text-start text-[22px] font-semibold">
                    <h1>
                      {getTranslation("Contacts", "جهات الاتصال", "Contacts")}
                    </h1>
                    <div className="flex items-center">
                      {!isConnected && (
                        <span className="mr-2 flex items-center text-sm text-error">
                          <span className="mr-1 h-2 w-2 rounded-full bg-error"></span>
                          {getTranslation("Offline", "غير متصل", "Hors ligne")}
                        </span>
                      )}
                      <button
                        onClick={handleOpenModal}
                        className="rounded-full p-1 hover:bg-bgSecondary"
                        title={getTranslation(
                          "Create new chat",
                          "إنشاء محادثة جديدة",
                          "Créer une nouvelle discussion",
                        )}
                      >
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 grid items-start">
                    <div>
                      <label htmlFor="icon" className="sr-only">
                        Search
                      </label>
                      <div className="relative min-w-48 md:min-w-80">
                        <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                          <svg
                            className="size-4 flex-shrink-0 text-textSecondary"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </div>
                        <input
                          onChange={e => setSearch(e.target.value)}
                          type="text"
                          id="icon"
                          name="icon"
                          className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                          placeholder={getTranslation(
                            "Search",
                            "بحث",
                            "Recherche",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 grid gap-2">
                    {localChats
                      .filter((chat: ChatData) => {
                        return search.toLocaleLowerCase() === ""
                          ? true
                          : chat.targetUser.name
                              .toLocaleLowerCase()
                              .includes(search.toLocaleLowerCase());
                      })
                      .map((chat: ChatData) => (
                        <div
                          key={chat.chatId}
                          onClick={() => handleChatClick(chat)}
                          className={`flex w-full cursor-pointer items-center border-b border-borderPrimary px-2 py-1 hover:bg-bgSecondary ${userId === chat.chatId ? "bg-bgSecondary" : ""}`}
                        >
                          <div
                            className={`${chat.numberOfNewMessages > 0 ? "w-[150px]" : "w-[200px]"}`}
                          >
                            {!chat.targetUser.hasPhoto ? (
                              <img
                                src="/images/userr.png"
                                className="mx-2 h-[40px] w-[40px] rounded-lg"
                                alt="User avatar"
                              />
                            ) : (
                              <img
                                src={chat.targetUser.photoLink}
                                className="mx-2 h-[40px] w-[40px] rounded-lg"
                                alt="User avatar"
                              />
                            )}
                          </div>
                          <div className="grid w-full gap-2 break-words">
                            <p className="font-semibold">
                              {chat.targetUser.name}

                              <span className="ml-1 text-[15px] text-secondary">
                                ({chat.targetUser.Role})
                              </span>
                            </p>
                            <p className="mt-2 w-[400px] break-words font-semibold text-secondary">
                              {chat.lastMessage}
                            </p>
                          </div>
                          <div className="grid w-full items-center justify-end gap-4 text-center text-end text-white">
                            <button
                              onClick={e => handleOpenModal2(chat.chatId, e)}
                            >
                              <svg
                                className="h-6 w-6 text-error"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                            {chat.numberOfNewMessages > 0 && (
                              <p className="rounded-full bg-primary px-2">
                                {chat.numberOfNewMessages}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    {localChats.length === 0 && !isLoading && (
                      <div className="mt-10 text-center text-textSecondary">
                        <p>
                          {getTranslation(
                            "No chats available",
                            "لا توجد محادثات",
                            "Pas de discussions disponibles",
                          )}
                        </p>
                        <button
                          onClick={handleOpenModal}
                          className="mt-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-hover"
                        >
                          {getTranslation(
                            "Start a new chat",
                            "بدء محادثة جديدة",
                            "Démarrer une nouvelle discussion",
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full rounded-xl bg-bgPrimary">
            {userId == "" ? (
              <div className="flex h-full w-full items-center justify-center">
                <img src="/images/emptyState.png" alt="Select a chat" />
              </div>
            ) : (
              <ChatPage
                userId={userId}
                regetusers={regetusers}
                userName={userName}
                userRole={userRole}
                realuserId={realUserId}
              />
            )}
          </div>
        </div>

        {/* Create New Chat Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {isGetting ? (
            <Spinner />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label
                htmlFor="targetUserId"
                className="grid text-[18px] font-semibold"
              >
                {getTranslation("New Chat", "محادثة جديدة", "Nouveau chat")}
                <SearchableSelect
                  name="targetUserId"
                  control={control}
                  errors={errors}
                  options={optionsRigon}
                  currentLanguage={currentLanguage}
                  placeholder={getTranslation(
                    "Select user",
                    "اختر مستخدم",
                    "Sélectionner un utilisateur",
                  )}
                />
              </label>
              <button
                disabled={isLoading}
                type="submit"
                className="mt-5 w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {isLoading
                  ? getTranslation(
                      "Adding...",
                      "يتم الإضافة...",
                      "Ajout en cours...",
                    )
                  : getTranslation(
                      "Add Chat",
                      "إضافة دردشة",
                      "Ajouter un Chat",
                    )}
              </button>
            </form>
          )}
        </Modal>

        {/* Delete Chat Modal */}
        <Modal isOpen={isModalOpen2} onClose={handleCloseModal2}>
          <div className="rounded-lg p-6 text-center">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              {getTranslation(
                "Are you sure you want to delete this chat?",
                "هل أنت متأكد من حذف هذه المحادثة؟",
                "Êtes-vous sûr de vouloir supprimer cette discussion?",
              )}
            </h2>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (selectedChatId) {
                    handleDelete(selectedChatId);
                    handleCloseModal2();
                  }
                }}
                className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                {getTranslation("Yes", "نعم", "Oui")}
              </button>

              <button
                onClick={handleCloseModal2}
                className="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                {getTranslation("No", "لا", "Non")}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Chat;
