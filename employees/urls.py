from django.urls import path
from .views import (
	AttendanceListView, AttendanceInfoView, 
	ClientView, DepartmentView, EmployeeView,
	EmployeeDeactivateView, EmployeePasswordChangeView,
	EmployeeExportDataView, HolidayView,
	ProjectView, ProjectFileView, ProjectCompletedView, ProjectEmployeesView,
	TaskView
)


urlpatterns = [
	path('api/attendance/info/', AttendanceInfoView.as_view(), name="attendance-info"),
	path('api/attendance/', AttendanceListView.as_view(), name="attendance-list"),
	path('api/clients/', ClientView.as_view(), name="clients"),
	path('api/clients/<str:id>/', ClientView.as_view(), name="client-detail"),
	path('api/departments/', DepartmentView.as_view(), name="departments"),
	path('api/departments/<str:id>/', DepartmentView.as_view(), name="department-detail"),
	path('api/employees/', EmployeeView.as_view(), name="employees"),
	path('api/employees/<str:id>/', EmployeeView.as_view(), name="employee-detail"),
	path('api/employees-deactivate/',
		EmployeeDeactivateView.as_view(), name="employee-deactivate"),
	path('api/employees/export/<str:file_type>/',
		EmployeeExportDataView.as_view(), name="employees-export"),
	path('api/employees/password/change/',
		EmployeePasswordChangeView.as_view(), name="employee-password-change"),
	path('api/holidays/', HolidayView.as_view(), name="holidays"),
	path('api/holidays/<str:id>/', HolidayView.as_view(), name="holiday-detail"),
	path('api/projects/', ProjectView.as_view(), name="projects"),
	path('api/projects/<str:id>/', ProjectView.as_view(), name="project-detail"),
	path('api/projects/<str:id>/completed/',
		ProjectCompletedView.as_view(),name="prject-completed"),
	path('api/projects/<str:id>/employees/', ProjectEmployeesView.as_view(),
		name="project-employees"),
	path('api/projects/<str:project_id>/files/', ProjectFileView.as_view(),
		name="project-files"),
	path('api/projects/<str:project_id>/files/<int:id>/', ProjectFileView.as_view(),
		name="project-files-detail"),
	path('api/projects/<str:project_id>/tasks/', TaskView.as_view(), name="project-tasks"),
	path('api/projects/<str:project_id>/tasks/<str:id>/',
		TaskView.as_view(), name="project-task-detail"),
]
