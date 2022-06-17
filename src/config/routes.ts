export const ADMIN_HOME_PAGE_URL = "/admin/";
export const HOME_PAGE_URL = "/"
export const JOBS_PAGE_URL = "/jobs/";
export const LOGIN_PAGE_URL = "/account/login/";
export const NOTIFICATIONS_PAGE_URL = "/notifications/";
export const PROFILE_PAGE_URL = "/profile/";


// Employees Section
export const ATTENDANCE_PAGE_URL = "/employees/attendance/";
export const ADMIN_LEAVES_PAGE_URL = "/employees/admin/leaves/";
export const ADMIN_LEAVE_DETAIL_PAGE_URL = (slug: string) => `/employees/admin/leaves/${slug}/`;
export const ADMIN_OVERTIME_PAGE_URL = "/employees/admin/overtime/";
export const ADMIN_OVERTIME_DETAIL_PAGE_URL = (slug: string) => `/employees/admin/overtime/${slug}/`;
export const CLIENTS_PAGE_URL = "/employees/clients/";
export const CLIENT_PAGE_URL = (slug: string) => `/employees/clients/${slug}/`;
export const DEPARTMENTS_PAGE_URL = "/employees/departments/";
export const EMPLOYEES_PAGE_URL = "/employees/all/";
export const EMPLOYEE_PAGE_URL = (slug: string) => `/employees/all/${slug}/`;
export const HOLIDAYS_PAGE_URL = `/employees/holidays/`;
export const LEAVES_PAGE_URL = "/employees/leaves/";
export const LEAVE_DETAIL_PAGE_URL = (slug: string) => `/employees/leaves/${slug}/`;
export const OVERTIME_PAGE_URL = "/employees/overtime/";
export const OVERTIME_DETAIL_PAGE_URL = (slug: string) => `/employees/overtime/${slug}/`;
export const PROJECTS_PAGE_URL = "/employees/projects/";
export const PROJECT_PAGE_URL = (slug: string) => `/employees/projects/${slug}/`;
export const PROJECT_TASKS_PAGE_URL = (slug: string) => `/employees/projects/${slug}/tasks/`;
export const PROJECT_TASK_PAGE_URL = (slug: string, id: string = "") => `/employees/projects/${slug}/tasks/${id}/`;
export const PROJECT_TEAM_PAGE_URL = (slug: string) => `/employees/projects/${slug}/team/`
