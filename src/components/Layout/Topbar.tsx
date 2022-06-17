import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa"
import { BRAND_IMAGE, DEFAULT_IMAGE } from "../../config"
import { NOTIFICATIONS_PAGE_URL } from "../../config/routes";
import { useNotificationsQuery } from "../../store/features/notifications-slice";
import { useAppSelector } from "../../hooks";

const Topbar = () => {
  const data = useAppSelector((state) => state.auth.data);
  const notifications = useNotificationsQuery(
    {limit: 1, offset: 0},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const unread: number = notifications.data?.unread_count || 0;

  return (
    <section className="bg-white flex items-center justify-between shadow-lg p-3 md:p-4 lg:p-5 xl:px-7 w-full">
      <div>
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          <div className="h-[30px] w-[130px]">
            <img
              className="h-full w-full"
              src={BRAND_IMAGE}
              alt="kite"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end w-full sm:w-1/3">
        <Link to={NOTIFICATIONS_PAGE_URL}>
          <span className="block cursor-pointer duration-300 mx-1 relative transform transition-all w-5 hover:scale-110">
            <span className="font-semibold text-primary-500">
              <FaBell className="font-semibold text-primary-500 text-base md:text-lg" />
              <span className="absolute bg-red-600 flex font-calibri justify-center items-center h-3 ml-2 p-1 right-0 rounded-full text-center text-gray-100 text-tiny top-0 w-3 md:p-[0.45rem] md:text-xs md:top-[-0.15rem] lg:p-[0.55rem] lg:right-[-0.15rem] lg:top-[-0.25rem]">
                {unread}
              </span>
            </span>
          </span>
        </Link>
        <div className="flex flex-col h-full justify-start text-right min-h-[1.5rem] mx-1 pt-2 sm:mx-3">
          <p className="capitalize font-semibold leading-tight text-primary-500 text-xs sm:leading-tighter sm:text-sm">
            {data
              ? data.full_name
              : "-------"}
          </p>
          <span className="capitalize pt-1 text-gray-400 text-xs sm:pt-0 lg:pt-2">
            {data && data?.job || ""}
          </span>
        </div>
        <div className="flex items-center justify-center mx-1 relative rounded-full">
          <div className="h-[30px] rounded-full w-[30px]">
            <img
              className="h-full rounded-full w-full"
              src={
                data && data.image !== undefined ? data.image : DEFAULT_IMAGE
              }
              alt=""
            />
          </div>
          <div className="absolute border border-gray-900 bg-green-700 bottom-0 h-2 right-0 rounded-full w-2" />
        </div>
      </div>
    </section>
  );
};

export default Topbar;
