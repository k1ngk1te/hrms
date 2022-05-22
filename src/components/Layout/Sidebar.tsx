import { forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaComment,
	FaPlaneDeparture,
	FaSignOutAlt,
	FaSuitcase,
	FaTimesCircle,
	FaThLarge,
	FaWarehouse,
	FaUser,
	FaUsers,
	FaJournalWhills,
} from "react-icons/fa";
import * as routes from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { baseApi } from "@/store/features/base";
import { open } from "@/store/features/alert-modal-slice";
import { logout } from "@/store/features/auth-slice";
import { useLogoutMutation } from "@/store/features/auth-api-slice";
import { SimpleLink, ListLink } from "@/components/Layout/Link";

const sidebarStyle =
	"absolute bg-primary-500 duration-1000 h-full overflow-y-auto transform top-16 w-3/4 z-50 sm:top-14 md:px-2 md:w-1/3 lg:fixed lg:px-0 lg:py-6 lg:top-0 lg:translate-x-0 lg:w-1/6 xl:py-7";

type PropsType = {
	setVisible: (e: boolean) => void;
	visible: boolean;
};

const Sidebar = forwardRef<HTMLDivElement, PropsType>(
	({ setVisible, visible }, ref) => {
		const dispatch = useAppDispatch();
		const data = useAppSelector((state) => state.auth.data);

		const navigate = useNavigate();

		const [signOut, { error, isLoading, isSuccess }] = useLogoutMutation();

		const links = [
			{
				admin: false,
				Icon: FaThLarge,
				title: "dashboard",
				href: routes.HOME_PAGE_URL,
			},
			{
				Icon: FaUsers,
				title: "employees",
				links: [
					{
						admin: true,
						Icon: FaUsers,
						title: "all employees",
						href: routes.EMPLOYEES_PAGE_URL,
					},
					{
						admin: false,
						Icon: FaSuitcase,
						title: "leaves",
						href: routes.LEAVES_PAGE_URL,
					},
					{
						admin: true,
						Icon: FaPlaneDeparture,
						title: "leaves (admin)",
						href: routes.ADMIN_LEAVES_PAGE_URL,
					},
					{
						Icon: FaUser,
						title: "attendance",
						href: routes.ATTENDANCE_PAGE_URL,
					},
					{
						admin: true,
						Icon: FaWarehouse,
						title: "departments",
						href: routes.DEPARTMENTS_PAGE_URL,
					},
					{
						admin: true,
						Icon: FaPlaneDeparture,
						title: "holidays",
						href: routes.HOLIDAYS_PAGE_URL,
					},
				]
			},
			{
				admin: false,
				Icon: FaUsers,
				title: "clients",
				href: routes.CLIENTS_PAGE_URL,
			},
			{
				admin: true,
				Icon: FaJournalWhills,
				title: "jobs",
				href: routes.JOBS_PAGE_URL,
			},
			{
				admin: false,
				Icon: FaComment,
				title: "notifications",
				href: routes.NOTIFICATIONS_PAGE_URL,
			},
			{
				admin: false,
				Icon: FaUser,
				title: "my profile",
				href: routes.PROFILE_PAGE_URL,
			},
		];

		useEffect(() => {
			if (error) {
				dispatch(
					open({
						color: "danger",
						decisions: [
							{
								color: "danger",
								disabled: isLoading,
								onClick: () => {
									signOut();
								},
								title: "Retry",
							},
						],
						header: "Logout Error",
						Icon: FaTimesCircle,
						message: "An error occurred when trying to sign out",
					})
				);
			}
		}, [dispatch, error, isLoading, signOut]);

		useEffect(() => {
			if (isSuccess) {
				dispatch(logout());
				dispatch(baseApi.util.resetApiState());
				navigate(routes.LOGIN_PAGE_URL);
			}
		}, [dispatch, isSuccess, navigate]);

		return (
			<nav
				ref={ref}
				className={`${
					visible ? "translate-x-0" : "-translate-x-full"
				} ${sidebarStyle}`}
			>
				<div className="flex flex-col items-center my-4 lg:mt-2">
					<div className="flex items-center justify-center mx-1 rounded-full">
						<div className="h-[75px] relative rounded-full w-[75px]">
							<img
								className="h-full rounded-full w-full"
								src={data?.image ? data?.image : "/static/images/default.png"}
								alt="user"
							/>
						</div>
					</div>
					{data?.first_name && data?.last_name && (
						<p className="capitalize italic mb-1 mt-2 text-white text-xs tracking-white md:text-sm">
							{data ? `${data?.first_name} ${data?.last_name}` : "No Name"}
						</p>
					)}
					{data?.job && (
						<span className="capitalize italic text-gray-300 text-tiny tracking-white md:text-xs">
							{data.job}
						</span>
					)}
				</div>
				<div className="mt-3">
					{links?.map(({ admin, href, ...props }, index) => {
						return "links" in props ? (
							<ListLink
								onClick={() => setVisible(false)}
								links={links}
								key={index}
								{...props}
							/>
						) : (
							<SimpleLink
								href={href || "#"}
								onClick={() => setVisible(false)}
								key={index}
								{...props}
							/>
						)
					})}
					<div
						onClick={() => {
							if (!isLoading) signOut();
							setVisible(false);
						}}
						className="my-1 lg:my-0"
					>
						<div
							className={`${
								isLoading
									? "bg-gray-700 cursor-not-allowed"
									: "cursor-pointer hover:bg-primary-300 hover:text-secondary-500"
							} capitalize flex justify-between items-center px-5 py-3 tracking-wide text-gray-100 text-sm lg:px-3 xl:pl-4`}
						>
							<div className="flex items-center">
								<span>
									<FaSignOutAlt className="text-gray-100 text-xs md:text-sm" />
								</span>
								<span className="mx-2">logout</span>
							</div>
							<div />
						</div>
					</div>
				</div>
			</nav>
		);
	}
);

export default Sidebar;
