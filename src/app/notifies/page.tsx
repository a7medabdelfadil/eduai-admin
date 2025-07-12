"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  useGetAllNotificationsQuery,
  usePutNotifiReadMutation,
  useDeleteNotificationMutation,
} from "@/features/communication/notficationsApi";
import Spinner from "@/components/spinner";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Pagination from "@/components/pagination";
import { useNotificationsSocket } from "@/hooks/useGetAllNotifications";
import { useUnreadNotificationsCount } from "@/hooks/useUnreadNotificationsCount";
import SeeMoreButton from "@/components/SeeMoreButton";

const Notifies = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const { notifications: socketNotifications, isConnected } =
    useNotificationsSocket(userId);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Notifications",
      nameAr: "الإشعارات",
      nameFr: "Notifications",
      href: "/notifies",
    },
  ];

  const formatTransactionDate = (dateString: string | number | Date) => {
    if (!dateString) return "No transaction date";
    const formatter = new Intl.DateTimeFormat("en-EG", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    });
    return formatter.format(new Date(dateString));
  };
  const [visibleCount, setVisibleCount] = useState(10);

  const { data, error, isLoading, refetch, isFetching } = useGetAllNotificationsQuery({
    page: 0,
    size: 1000000,
  });
  useEffect(() => {
    const handleNewNotification = () => {
      refetch();
    };

    window.addEventListener("new-notification", handleNewNotification);

    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, [refetch]);

  const allNotifications = [...(socketNotifications || []), ...(data?.data.content || [])];


  const [readNotifi] = usePutNotifiReadMutation();
  const [deleteNotifi] = useDeleteNotificationMutation();

  const { unreadCount, refetch: refetchNotificationsCounts } = useUnreadNotificationsCount();
  const [readingId, setReadingId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setNotifications([...(socketNotifications || []), ...(data.data.content || [])]);
    }
  }, [data, socketNotifications]);

  const displayedNotifications = notifications.slice(0, visibleCount);
  const [pendingReadIds, setPendingReadIds] = useState<Set<string>>(new Set());
  const handleRead = async (id: string, read: boolean) => {
    if (read || readingId || isFetching) return; // ⛔ امنع التكرار
    setReadingId(id);
    try {
      await readNotifi(id).unwrap();
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      toast.success(`Notification read`);

      setPendingReadIds((prev) => new Set(prev).add(id));
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    } finally {
      setReadingId(null);
    }
  };

  useEffect(() => {
    if (pendingReadIds.size === 0) return;
    const timeout = setTimeout(() => {
      refetchNotificationsCounts();
      setPendingReadIds(new Set()); // reset
    }, 600); // Delay to batch multiple reads

    return () => clearTimeout(timeout);
  }, [pendingReadIds]);

  const handleDelete = async (id: string) => {
    try {
      await deleteNotifi(id).unwrap();
      toast.success(`Notification Deleted`);
      void refetch();
      void refetchNotificationsCounts();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
          ? booleanValue
            ? "lg:mr-[120px]"
            : "lg:mr-[290px]"
          : booleanValue
            ? "lg:ml-[120px]"
            : "lg:ml-[290px]"
          } mt-12`}
      >
        <div className="flex justify-end">
          <Link
            href="/notifies/send-notifications"
            className="mx-3 mb-5 flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
          >
            <svg
              className="h-7 w-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            {currentLanguage === "ar"
              ? "إرسال الإشعارات"
              : currentLanguage === "fr"
                ? "Envoyer des notifications"
                : "Send Notifications"}
          </Link>
        </div>
        <div className="grid h-full w-full items-center justify-center gap-3 rounded-xl bg-bgPrimary p-5">
          <div className="mb-5 flex w-full justify-start">
            <h1 className="text-[22px] font-semibold">
              {currentLanguage === "ar"
                ? "الإشعارات"
                : currentLanguage === "fr"
                  ? "Notifications"
                  : "Notifications"}
            </h1>
          </div>

          {displayedNotifications.map((notifi: any, index: number) => (
            <div

              key={`${notifi.id}-${index}`}
              onClick={() => handleRead(notifi.id, notifi.read)}
              className={`pointer-events-${readingId || isFetching ? "none" : "auto"} flex gap-2 ${notifi.read ? "bg-bgPrimary" : "bg-thead"} cursor-pointer h-full w-[1000px] rounded-lg p-3 shadow-xl max-[1340px]:w-[700px] max-[1040px]:w-[500px] max-[550px]:w-[300px]`}
            >
              <div>
                {notifi.picture == null ? (
                  <img
                    src="/images/userr.png"
                    className="mx-2 h-[40px] w-[40px] rounded-full"
                    alt="#"
                  />
                ) : (
                  <img
                    src={notifi.picture}
                    className="mx-2 h-[40px] w-[40px] rounded-full"
                    alt="#"
                  />
                )}
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="line-clamp-2 break-words break-all font-semibold text-base text-textPrimary">
                    {notifi.title}
                  </h1>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400">
                      {formatTransactionDate(notifi.timestamp)}
                    </span>
                    {!notifi.read && (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {notifi.read ? (
                    <button className="text-[20px] text-gray-600">
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="text-[20px] text-gray-600"
                    >
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notifi.id)}
                    className="text-[20px] text-gray-600"
                  >
                    <svg
                      className="h-5 w-5 text-gray-500"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <line x1="18" y1="6" x2="6" y2="18" />{" "}
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {visibleCount < allNotifications.length && (
            <SeeMoreButton
              onClick={() => setVisibleCount(prev => prev + 10)}
              label={
                currentLanguage === "ar"
                  ? "عرض المزيد"
                  : currentLanguage === "fr"
                    ? "Voir plus"
                    : "See More"
              }
            />
          )}

        </div>
      </div>
    </>
  );
};

export default Notifies;
