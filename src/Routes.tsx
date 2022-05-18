import { Routes, Route } from "react-router-dom";

import * as routes from "@/config/routes";

import Layout from "@/Layout";

import { Authenticated, CheckAuth, NotAuthenticated } from "@/utils";

import NotFoundPage from "@/pages/404";

import DepartmentsPage from "@/pages/departments";
import EmployeesPage from "@/pages/admin/employees";
import EmployeesDetailPage from "@/pages/admin/employees/detail";
import HomePage from "@/pages";
import JobsPage from "@/pages/jobs";
import LeavesPage from "@/pages/leaves";
import LeavesDetailPage from "@/pages/leaves/detail";
import LeavesAdminPage from "@/pages/admin/leaves";
import LeavesAdminDetailPage from "@/pages/admin/leaves/detail";
import LoginPage from "@/pages/account/login";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile"


const AppRoutes = () => (
  <Routes>
    <Route path="*" element={<NotFoundPage />} />

    <Route element={<CheckAuth />}>
      <Route element={<NotAuthenticated />}>
        <Route path={routes.LOGIN_PAGE_URL} element={<LoginPage />} />

      </Route>

      <Route element={<Authenticated />}>
        <Route element={<Layout />}>
          <Route path={routes.DEPARTMENTS_PAGE_URL} element={<DepartmentsPage />} />
          <Route path={routes.EMPLOYEES_PAGE_URL}>
            <Route path="" element={<EmployeesPage />} />
            <Route path=":id" element={<EmployeesDetailPage />} />
          </Route>
          <Route path={routes.JOBS_PAGE_URL} element={<JobsPage />} />
          <Route path={routes.HOME_PAGE_URL} element={<HomePage />} />
          <Route path={routes.LEAVES_PAGE_URL}>
            <Route path="" element={<LeavesPage />} />
            <Route path=":id" element={<LeavesDetailPage />} />
          </Route>
          <Route path={routes.ADMIN_LEAVES_PAGE_URL}>
            <Route path="" element={<LeavesAdminPage />} />
            <Route path=":id" element={<LeavesAdminDetailPage />} />
          </Route>
          <Route path={routes.NOTIFICATIONS_PAGE_URL} element={<NotificationsPage />} />
          <Route path={routes.PROFILE_PAGE_URL} element={<ProfilePage />} />
        </Route>
      </Route>
    </Route>
  </Routes>
)

export default AppRoutes;