from django.urls import path
from .views import (
	LeaveView, LeaveAdminView, LeaveExportDataView,
	OvertimeView, OvertimeAdminView, OvertimeExportDataView
)

urlpatterns = [
	path('api/leaves/admin/', LeaveAdminView.as_view(), name="leaves-admin"),
	path('api/leaves/admin/<str:id>/', LeaveAdminView.as_view(), name="leave-admin-detail"),
	path('api/leaves/admin/export/<str:file_type>/',
		LeaveExportDataView.as_view(), name="leave-admin-export"),
	path('api/leaves/', LeaveView.as_view(), name="leaves"),
	path('api/leaves/<str:id>/', LeaveView.as_view(), name="leave-detail"),
	
	path('api/overtime/admin/', OvertimeAdminView.as_view(), name="overtime-admin"),
	path('api/overtime/admin/<str:id>/', OvertimeAdminView.as_view(), name="overtime-admin-detail"),
	path('api/overtime/admin/export/<str:file_type>/',
		OvertimeExportDataView.as_view(), name="overtime-admin-export"),
	path('api/overtime/', OvertimeView.as_view(), name="overtime"),
	path('api/overtime/<str:id>/', OvertimeView.as_view(), name="overtime-detail"),
]
