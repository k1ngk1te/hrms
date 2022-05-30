from django.urls import path
from .views import (
	LeaveAdminListView, LeaveAdminDetailView,
	LeaveDetailView, LeaveListView, LeaveExportDataView
)

urlpatterns = [
	path('api/leaves/', LeaveListView.as_view(), name="leaves"),
	path('api/leaves/<str:id>/', LeaveDetailView.as_view(), name="leave-detail"),
	path('api/leaves/admin/', LeaveAdminListView.as_view(), name="leaves-admin"),
	path('api/leaves/admin/<str:id>/', LeaveAdminDetailView.as_view(), name="leave-admin-detail"),
	path('api/leaves/admin/export/<str:file_type>/',
		LeaveExportDataView.as_view(), name="leave-admin-export"),
]
