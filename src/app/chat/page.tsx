"use client";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";

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
import { BiSearchAlt } from "react-icons/bi";
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
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [localChats, setLocalChats] = useState<ChatData[]>([]);
  const currentUserId =
    useSelector((state: RootState) => state.user?.id) || null;

  // Keep track of if this is first load
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (data?.data?.content) {
      if (isInitialMount.current) {
        setLocalChats(data.data.content);
        isInitialMount.current = false;
      } else {
        setLocalChats(prevChats => {
          const updatedChats = [...data.data.content];
          return updatedChats.map(newChat => {
            const existingChat = prevChats.find(
              c => c.chatId === newChat.chatId,
            );
            return existingChat
              ? {
                  ...newChat,
                  numberOfNewMessages: existingChat.numberOfNewMessages,
                }
              : newChat;
          });
        });
      }
    }
  }, [data]);

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
      setDeleting(true);
      await deleteChat(id).unwrap();
      toast.success(`Chat with ID ${id} deleted successfully`);
      setLocalChats(prevChats => prevChats.filter(chat => chat.chatId !== id));

      if (userId === id) {
        setUserId("");
        setUserName("");
        setUserRole("");
        setRealUserId("");
      }
      regetusers();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    } finally {
      setDeleting(false);
    }
  };

  const onSubmit = async (formData: any) => {
    setCreating(true);
    try {
      const existingChat = localChats.find(
        chat => chat.targetUser.id === formData.targetUserId,
      );

      if (existingChat) {
        toast.info(
          getTranslation(
            "Chat already exists",
            "المحادثة موجودة بالفعل",
            "La discussion existe déjà",
          ),
        );
        setUserId(existingChat.chatId);
        setUserName(existingChat.targetUser.name);
        setUserRole(existingChat.targetUser.Role);
        setRealUserId(existingChat.targetUser.id);
        setModalOpen(false);
        return;
      }

      const result = await createChat(formData).unwrap();

      setModalOpen(false);
      toast.success(
        getTranslation(
          "Chat created successfully",
          "تم إنشاء المحادثة بنجاح",
          "Discussion créée avec succès",
        ),
      );

      if (result?.data) {
        handleChatUpdate({
          chatId: result.data.chatId,
          lastMessage: "Chat started",
          numberOfNewMessages: 0,
          targetUser: result.data.targetUser,
        });

        setUserId(result.data.chatId);
        setUserName(result.data.targetUser.name);
        setUserRole(result.data.targetUser.Role);
        setRealUserId(result.data.targetUser.id);
      }

      regetusers();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    } finally {
      setCreating(false);
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

      <Container>
        <div className="-ml-1 -mt-2 mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Reported Chat"
              : currentLanguage === "ar"
                ? "الدردشة المُبلَّغ عنها"
                : currentLanguage === "fr"
                  ? "Discussion signalée"
                  : "Reported Chat"}{" "}
            {/* default */}
          </h1>
        </div>
        <div
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          className="w-full justify-between gap-10 rounded-xl bg-bgPrimary p-6 min-[1180px]:flex"
        >
          <div className="mb-6 h-[700px] w-[40%] overflow-y-auto rounded-xl bg-bgPrimary max-[1180px]:h-fit max-[1180px]:w-full">
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <div className="mt-6 flex items-center justify-between">
                    {/* Search Input */}
                    <div
                      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                      className="relative w-full max-w-md"
                    >
                      <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                        <BiSearchAlt className="text-secondary" size={18} />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          onChange={e => setSearch(e.target.value)}
                          type="text"
                          className={`w-full border-borderPrimary bg-bgPrimary ${currentLanguage == "ar" ? "ml-4" : "mr-4"} rounded-xl border-2 px-4 py-2 ps-11 text-lg outline-none`}
                          placeholder={getTranslation(
                            "Search",
                            "بحث",
                            "Recherche",
                          )}
                        />
                      </div>
                    </div>

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
                          className={`flex w-full cursor-pointer items-center border-b border-borderPrimary px-2 py-2 hover:bg-bgSecondary ${
                            userId === chat.chatId ? "bg-bgSecondary" : ""
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={
                                chat.targetUser.hasPhoto
                                  ? chat.targetUser.photoLink
                                  : "/images/userr.png"
                              }
                              alt="User avatar"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>

                          <div className="ml-4 min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="truncate font-semibold">
                                {chat.targetUser.name}
                                <span className="ml-1 text-[15px] text-secondary">
                                  ({chat.targetUser.Role})
                                </span>
                              </p>
                              {chat.numberOfNewMessages > 0 && (
                                <span className="ml-2 rounded-full bg-primary px-2 text-sm text-white">
                                  {chat.numberOfNewMessages}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-secondary">
                              {chat.lastMessage}
                            </p>
                          </div>

                          <button
                            onClick={e => handleOpenModal2(chat.chatId, e)}
                            className="ml-4 text-error"
                          >
                            <svg
                              className="h-6 w-6"
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
                          className="mt-2 rounded-xl bg-primary px-4 py-2 text-white hover:bg-hover"
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
          <div className="flex h-[700px] w-[60%] rounded-xl bg-bgSecondary max-[1180px]:w-full">
            {userId == "" ? (
              <div className="flex h-full w-full items-center justify-center">
                <div>
                  <img
                    src="/images/chat.png"
                    alt="Select a chat"
                    className="block dark:hidden"
                  />
                  <img
                    src="/images/chat-dark.png"
                    alt="Select a chat (dark)"
                    className="hidden dark:block"
                  />
                </div>
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
                disabled={creating}
                type="submit"
                className="mt-5 w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {creating
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
          <div className="rounded-xl p-6 text-center">
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
      </Container>
    </>
  );
};

export default Chat;
