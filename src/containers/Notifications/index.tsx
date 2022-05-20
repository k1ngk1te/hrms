import { useEffect, useState } from "react";
import { FaSadTear } from "react-icons/fa";
import { logout } from "@/store/features/auth-slice";
import { useNotificationsQuery } from "@/store/features/notifications-slice";
import {
  ADMIN_LEAVE_DETAIL_PAGE_URL,
  LEAVE_DETAIL_PAGE_URL,
} from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Container, Pagination } from "@/components/common";
import { Audit } from "@/components/Notifications";

const NoData = () => (
  <div className="bg-gray-200 flex flex-col h-full items-center justify-center w-full">
    <div className="flex flex-col items-center">
      <span className="leading-[0px] inline-block text-gray-400 text-[120px]">
      	<FaSadTear className="text-gray-500 text-[120px]" style={{ fontSize: "120px" }} />
      </span>
      <p className="font-semibold mt-2 text-center text-gray-500 text-base md:text-lg">
        You have 0 notifications.
      </p>
    </div>
  </div>
);

const Notifications = () => {
  const [offset, setOffset] = useState(0);
  const notifications = useNotificationsQuery(
    { limit: 100, offset },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const authData = useAppSelector((state) => state.auth.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const err =
      notifications.error &&
      "status" in notifications.error &&
      notifications.error?.status === 401;
    if (err === true) dispatch(logout());
  }, [dispatch, notifications.error]);

  return (
    <Container
      heading="Notifications"
      refresh={{
        onClick: () => notifications?.refetch(),
        loading: notifications?.isFetching,
      }}
      loading={notifications.isLoading}
    >
	    <div className="bg-gray-200 h-full max-w-4xl mx-auto p-3 rounded-lg w-full sm:px-4 md:py-5 lg:py-8">
	      {notifications.data !== undefined &&
	      notifications.data?.results.length <= 0 ? (
	        <NoData />
	      ) : (
	        notifications.data?.results.map((notification, index) => (
	          <Audit
	            key={index}
	            id={notification.id}
	            date_sent={notification.date_sent}
	            goto={
	              notification._type === "L"
	                ? authData && authData?.is_admin && notification.recipient.email === authData?.email
	                  ? ADMIN_LEAVE_DETAIL_PAGE_URL(notification.message_id)
	                  : LEAVE_DETAIL_PAGE_URL(notification.message_id)
	                : undefined
	            }
	            read={notification.read}
	            message={notification.message}
	          />
	        ))
	      )}
	      {notifications.data && notifications.data?.results.length > 0 && (
	        <div className="pt-2 pb-5">
	          <Pagination
	            disabled={notifications.isFetching}
	            onChange={(pageNo: number) => {
	              const value = pageNo - 1 <= 0 ? 0 : pageNo - 1;
	              offset !== value && setOffset(value * 50);
	            }}
	            totalItems={notifications.data.count}
	          />
	        </div>
	      )}
	    </div>
    </Container>
  );
};

export default Notifications;
