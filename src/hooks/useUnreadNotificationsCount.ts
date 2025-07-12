import { useGetAllNotificationsQuery } from "@/features/communication/notficationsApi";
import { useMemo } from "react";

export const useUnreadNotificationsCount = () => {
  const {
    data,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllNotificationsQuery({ page: 0, size: 1000000 });

  const unreadCount = useMemo(() => {
    const list = data?.data?.content || [];
    return list.filter((n: any) => !n.read).length;
  }, [data]);

  return {
    unreadCount,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
