from django.urls import path
from .views import (
	ClientListView, ClientDetailView,
	DepartmentListView, DepartmentDetailView,
	EmployeeListView, EmployeeDetailView, 
	EmployeeDeactivateView, EmployeePasswordChangeView,
	EmployeeExportDataView
)


urlpatterns = [
	path('api/clients/', ClientListView.as_view(), name="clients"),
	path('api/clients/<int:id>/', ClientDetailView.as_view(), name="client-detail"),
	path('api/departments/', DepartmentListView.as_view(), name="departments"),
	path('api/departments/<int:id>/', DepartmentDetailView.as_view(), name="department-detail"),
	path('api/employees/', EmployeeListView.as_view(), name="employees"),
	path('api/employees/<int:id>/', EmployeeDetailView.as_view(), name="employee-detail"),
	path('api/employees/deactivate/', 
		EmployeeDeactivateView.as_view(), name="employee-deactivate"),
	path('api/employees/export/<str:file_type>/', 
		EmployeeExportDataView.as_view(), name="employees-export"),
	path('api/employees/password/change/', 
		EmployeePasswordChangeView.as_view(), name="employee-password-change"),
]