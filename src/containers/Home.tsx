import { FaBell, FaSuitcase, FaUsers } from "react-icons/fa";
import { LEAVES_PAGE_URL } from "../config/routes";
import { useGetEmployeesQuery } from "../store/features/employees-slice";
import { useGetAdminLeavesQuery } from "../store/features/leaves-slice";
import { useNotificationsQuery } from "../store/features/notifications-slice";
import { useAppSelector } from "../hooks";
import { getDateString } from "../utils";
import { StatsCard } from "../components/Attendance";
import { Card, Container } from "../components/common";
import { Button } from "../components/controls";

const Home = () => {
  const user = useAppSelector((state) => state.auth.data);

  const employees = useGetEmployeesQuery(
    { limit: 1, offset: 0 },
    {
      skip: user ? !user?.is_admin : true,
    }
  );
  const leaves = useGetAdminLeavesQuery(
    { limit: 1, offset: 0, from: "", to: "" },
    {
      skip: user ? !user?.is_admin : true,
    }
  );
  const notifications = useNotificationsQuery(
    { limit: 1, offset: 0 },
    {
      skip: user ? !user?.is_admin : true,
    }
  );

  const _leaves: any = [
    { title: "leave taken", value: (user && user.leaves_taken) || 0 },
    { title: "remaining", value: (user && user.leaves_remaining) || 12 },
  ];

  const cards = [
    {
      title: "EMPLOYEES",
      Icon: FaUsers,
      txtColor: "text-primary-500",
      value: employees.data?.count || 0,
    },
    {
      title: "LEAVE REQUESTS",
      txtColor: "text-yellow-500",
      Icon: FaSuitcase,
      value: leaves.data?.pending_count || 0,
    },
    {
      title: "NOTIFICATIONS",
      txtColor: "text-red-500",
      Icon: FaBell,
      value: notifications.data?.unread_count || 0,
    },
  ];

  const date = new Date();
  const toDay = getDateString(date);
  const toDate = date.getDate();
  const toMonth = getDateString(date, "month");
  const toYear = date.getFullYear();

  return (
    <Container heading="Dashboard" loading={false}>
      <div className="bg-gray-100 w-full">
        <div className="bg-white flex items-center justify-between pr-5 p-3 rounded-lg shadow-lg md:items-start md:px-6 lg:py-5">
          <div className="w-3/4 md:w-4/5">
            <h1 className="capitalize font-bold text-gray-700 text-2xl md:text-3xl">
              welcome, {`${user?.first_name} ${user?.last_name}`}
            </h1>
            <p className="capitalize font-semibold my-2 text-gray-600 text-sm md:text-base md:my-4 lg:text-lg">
              {`${toDay}, ${toDate} ${toMonth} ${toYear}`}
            </p>
          </div>
          <div className="w-1/4 md:w-1/5">
            <div className="h-[75px] relative w-[75px] md:h-[150px] md:w-[150px]">
              <img
                className="h-full w-full"
                src={(user && user?.image) || "/static/images/users/default.png"}
                title="user"
              />
            </div>
          </div>
        </div>
        {user && user.is_admin && (
          <div className="gap-4 grid grid-cols-1 mt-5 md:gap-5 md:grid-cols-3">
            {cards.map((card, index) => (
              <Card {...card} key={index} />
            ))}
          </div>
        )}

        <StatsCard />

        <div className="flex flex-col items-center w-full md:flex-row md:items-start md:justify-between">
          <div className="mt-5 w-full md:pr-2 md:w-1/2">
            <h4 className="font-semibold my-2 px-1 text-primary-700 text-sm uppercase md:text-base">
              leave taken this year
            </h4>
            <div className="bg-white divide-x divide-gray-500 divide-opacity-50 flex flex-wrap items-center my-2 py-3 rounded-lg shadow-lg md:my-3">
              {_leaves.map((leave: any, index: any) => (
                <div key={index} className="my-2 p-3 w-1/2">
                  <p className="font-bold text-center text-gray-700">
                    {leave.value}
                  </p>
                  <p className="my-2 text-center text-gray-600 uppercase">
                    {leave.title}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-center my-3 w-full">
                <div>
                  <Button
                    bold="normal"
                    caps
                    link={LEAVES_PAGE_URL}
                    title="request leave"
                    titleSize="text-sm md:text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 w-full md:pl-2 md:w-1/2">
            <h4 className="font-semibold my-2 px-1 text-primary-700 text-sm uppercase md:text-base">
              upcoming holiday
            </h4>
            <div className="bg-white flex justify-center my-2 py-3 rounded-lg shadow-lg text-center md:my-3">
              <p className="capitalize font-semibold text-gray-600 text-sm md:text-base">
                Mon 20 May 2019 - Ramzan
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
