from django.urls import path
from .views import (
	AttendanceView, ClientView, DepartmentView, EmployeeView,
	EmployeeDeactivateView, EmployeePasswordChangeView,
	EmployeeExportDataView, HolidayView,
)


urlpatterns = [
	path('api/attendance/', AttendanceView.as_view(), name="attendance"),
	path('api/attendance/<int:id>/', AttendanceView.as_view(), name="attendance-detail"),
	path('api/clients/', ClientView.as_view(), name="clients"),
	path('api/clients/<int:id>/', ClientView.as_view(), name="client-detail"),
	path('api/departments/', DepartmentView.as_view(), name="departments"),
	path('api/departments/<int:id>/', DepartmentView.as_view(), name="department-detail"),
	path('api/employees/', EmployeeView.as_view(), name="employees"),
	path('api/employees/<int:id>/', EmployeeView.as_view(), name="employee-detail"),
	path('api/employees/deactivate/', 
		EmployeeDeactivateView.as_view(), name="employee-deactivate"),
	path('api/employees/export/<str:file_type>/', 
		EmployeeExportDataView.as_view(), name="employees-export"),
	path('api/employees/password/change/', 
		EmployeePasswordChangeView.as_view(), name="employee-password-change"),
	path('api/holidays/', HolidayView.as_view(), name="holidays"),
	path('api/holidays/<int:id>/', HolidayView.as_view(), name="holiday-detail"),
]