"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useGetAllChatsQuery, useCreateNewChatMutation, useDeleteChatMutation } from "@/features/chat/chatApi";
import Spinner from "@/components/spinner";
import Modal from "@/components/model";
import SearchableSelect from "@/components/select";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetAllUsersChatQuery } from "@/features/User-Management/teacherApi";

const ChatPage = dynamic(() => import("@/components/chat"), { ssr: false });
const Chat = () => {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserNane] = useState("")
  const [createChat] = useCreateNewChatMutation();
  const { data: users, isLoading: isGetting } = useGetAllUsersChatQuery(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const optionsRigon =
  users?.data?.content.map(
    (user: {
      Role: any;
      id: any;
      name: any;
    }) => ({
      value: user.id,
      label: `${user.name} - ${user.Role}`,
    }),
    ) || [];
    const { data, isLoading, refetch: regetusers } = useGetAllChatsQuery(null);
    const [deleteChat] = useDeleteChatMutation();
    
console.log(userName);

  const handleDelete = async (id: string) => {
    try {
      await deleteChat(id).unwrap();
      toast.success(`Chat with ID ${id} Deleted successfully`);
      regetusers();
    } catch (err) {
      toast.error("Failed to Delete the Chat");
    }
  };
  const onSubmit = async (data: any) => {
    try {
      await createChat(data).unwrap();
      setModalOpen(false);
      regetusers();
      toast.success("Chat created successfully");
    } catch {
      toast.error(
        "Failed to create Chat",
      );
    }
  };
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleClick = (id: string) => {
    setUserId(id);
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

  return (
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
      }  mt-10`}
    >
      <div className="flex w-full justify-between gap-10 rounded-lg p-4 max-[1180px]:grid max-[1180px]:justify-center">
        <div className="h-[700px] w-full overflow-y-auto rounded-xl bg-bgPrimary p-5">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex justify-between text-start text-[22px] font-semibold">
                  <h1>Contacts</h1>
                  <button onClick={handleOpenModal}>
                    <svg className="h-8 w-8"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
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
                        placeholder={
                          currentLanguage === "en"
                            ? "Search"
                            : currentLanguage === "ar"
                              ? "بحث"
                              : "Recherche"
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid gap-2">
                  {data?.data?.content
                    .filter((chat: any) => {
                      return search.toLocaleLowerCase() === ""
                        ? chat
                        : chat.targetUser.name.toLocaleLowerCase().includes(search);
                    })
                    .map((chat: any) => (
                      <div
                        key={chat.id}
                        onClick={() => {handleClick(chat.chatId); setUserNane(chat.targetUser.name); regetusers();}}
                        className="flex w-full cursor-pointer items-center border-b border-borderPrimary px-2 py-1 hover:bg-bgSecondary"
                      >
                        <div className={`${chat.numberOfNewMessages > 0 ? "w-[150px]" : "w-[200px]"}`}>
                          {!chat.targetUser.hasPhoto ? (
                            <img
                              src="/images/userr.png"
                              className="mx-2 h-[40px] w-[40px] rounded-lg"
                              alt="#"
                            />
                          ) : (
                            <img
                              src={chat.targetUser.photoLink}
                              className="mx-2 h-[40px] w-[40px] rounded-lg"
                              alt="#"
                            />
                          )}
                        </div>
                        <div className="grid gap-2 w-full break-words">
                          <p className="font-semibold ">
                            {chat.targetUser.name}
                            
                            <span className="text-[15px] text-secondary">
                              ({chat.targetUser.Role})
                            </span>
                          </p>
                          <p className="font-semibold text-secondary break-words w-[400px] mt-2">
                            {chat.lastMessage}
                          </p>
                        </div>
                        <div className="grid justify-end items-center gap-4 text-center w-full text-end text-white">
                          <button onClick={()=>handleDelete(chat.chatId)}>
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
                        {
                          chat.numberOfNewMessages > 0 &&(
                          <p className="px-2 rounded-full bg-primary">{chat.numberOfNewMessages}</p>
                          )
                        }
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex w-full rounded-xl bg-bgPrimary">
          {userId == "" ? (
            <div className="flex h-full w-full items-center justify-center">
              <img src="/images/emptyState.png" alt="#" />
            </div>
          ) : (
            <ChatPage userId={userId} regetusers={regetusers} userName={userName}/>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {
            isGetting ? <Spinner/> : 
        <form onSubmit={handleSubmit(onSubmit)}>
        <label
                htmlFor="targetUserId"
                className="grid font-sans text-[18px] font-semibold"
              >
                {currentLanguage === "en"
                  ? "New Chat"
                  : currentLanguage === "ar"
                    ? "محادثة جديدة"
                    : currentLanguage === "fr"
                      ? "Nouveau chat"
                      : "Nouveau chat"}{" "}
                {/* default */}
                <SearchableSelect
                  name="targetUserId"
                  control={control}
                  errors={errors}
                  options={optionsRigon}
                  currentLanguage={currentLanguage}
                  placeholder="Select Chat"
                />
              </label>
              <button
                disabled={isLoading}
                type="submit"
                className="w-fit rounded-xl bg-primary px-4 py-2 text-[18px] text-white duration-300 ease-in hover:bg-hover hover:shadow-xl mt-5"
              >
                {isLoading
                  ? currentLanguage === "en"
                    ? "Adding..."
                    : currentLanguage === "ar"
                      ? "يتم الإضافة..."
                      : currentLanguage === "fr"
                        ? "Ajout en cours..."
                        : "Adding..." // default
                  : currentLanguage === "en"
                    ? "Add Chat"
                    : currentLanguage === "ar"
                      ? "إضافة دردشة"
                      : currentLanguage === "fr"
                        ? "Ajouter un Chat"
                        : "Add Driver"}
              </button>
        </form>
          }
      </Modal>
    </div>
  );
};

export default Chat;
