import { Routes, Route } from "react-router-dom";

import * as routes from "./config/routes";

import Layout from "./Layout";

import { Authenticated, CheckAuth, NotAuthenticated } from "./utils";

import NotFoundPage from "./pages/404";

import HomePage from "./pages";
import JobsPage from "./pages/jobs";
import LoginPage from "./pages/account/login";
import NotificationsPage from "./pages/notifications";
import ProfilePage from "./pages/profile";

// Employees Section
import AttendancePage from "./pages/attendance";
import ClientsPage from "./pages/clients";
import ClientPage from "./pages/clients/detail";
import DepartmentsPage from "./pages/departments";
import EmployeesPage from "./pages/admin/employees";
import EmployeesDetailPage from "./pages/admin/employees/detail";
import HolidaysPage from "./pages/holidays";
import LeavesPage from "./pages/leaves";
import LeavesDetailPage from "./pages/leaves/detail";
import LeavesAdminPage from "./pages/admin/leaves";
import LeavesAdminDetailPage from "./pages/admin/leaves/detail";
import OvertimePage from "./pages/overtime";
import OvertimeDetailPage from "./pages/overtime/detail";
import OvertimeAdminPage from "./pages/admin/overtime";
import OvertimeAdminDetailPage from "./pages/admin/overtime/detail";
import ProjectsPage from "./pages/projects";
import ProjectPage from "./pages/projects/detail";
import ProjectTasksPage from "./pages/projects/detail/tasks";
import ProjectTaskPage from "./pages/projects/detail/tasks/detail";
import ProjectTeamPage from "./pages/projects/detail/team";

const AppRoutes = () => (
	<Routes>
		<Route path="*" element={<NotFoundPage />} />

		<Route element={<CheckAuth />}>
			<Route element={<NotAuthenticated />}>
				<Route path={routes.LOGIN_PAGE_URL} element={<LoginPage />} />
			</Route>

			<Route element={<Authenticated />}>
				<Route element={<Layout />}>
					{/* Employees Section Start */}
					<Route
						path={routes.ATTENDANCE_PAGE_URL}
						element={<AttendancePage />}
					/>
					<Route path={routes.CLIENTS_PAGE_URL}>
						<Route path="" element={<ClientsPage />} />
						<Route path=":id" element={<ClientPage />} />
					</Route>
					<Route
						path={routes.DEPARTMENTS_PAGE_URL}
						element={<DepartmentsPage />}
					/>
					<Route path={routes.EMPLOYEES_PAGE_URL}>
						<Route path="" element={<EmployeesPage />} />
						<Route path=":id" element={<EmployeesDetailPage />} />
					</Route>
					<Route path={routes.LEAVES_PAGE_URL}>
						<Route path="" element={<LeavesPage />} />
						<Route path=":id" element={<LeavesDetailPage />} />
					</Route>
					<Route path={routes.ADMIN_LEAVES_PAGE_URL}>
						<Route path="" element={<LeavesAdminPage />} />
						<Route path=":id" element={<LeavesAdminDetailPage />} />
					</Route>
					<Route path={routes.OVERTIME_PAGE_URL}>
						<Route path="" element={<OvertimePage />} />
						<Route path=":id" element={<OvertimeDetailPage />} />
					</Route>
					<Route path={routes.ADMIN_OVERTIME_PAGE_URL}>
						<Route path="" element={<OvertimeAdminPage />} />
						<Route path=":id" element={<OvertimeAdminDetailPage />} />
					</Route>
					<Route path={routes.HOLIDAYS_PAGE_URL} element={<HolidaysPage />} />
					<Route path={routes.PROJECTS_PAGE_URL}>
						<Route path="" element={<ProjectsPage />} />
						<Route path=":id">
							<Route path="" element={<ProjectPage />} />
							<Route path="tasks">
								<Route path="" element={<ProjectTasksPage />} />
								<Route path=":task_id" element={<ProjectTaskPage />} />
							</Route>
							<Route path="team" element={<ProjectTeamPage />} />
						</Route>
					</Route>
					{/* Employees Section Stop */}

					<Route path={routes.JOBS_PAGE_URL} element={<JobsPage />} />
					<Route path={routes.HOME_PAGE_URL} element={<HomePage />} />
					<Route
						path={routes.NOTIFICATIONS_PAGE_URL}
						element={<NotificationsPage />}
					/>
					<Route path={routes.PROFILE_PAGE_URL} element={<ProfilePage />} />
				</Route>
			</Route>
		</Route>
	</Routes>
);

export default AppRoutes;
