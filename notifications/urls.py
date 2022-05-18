from django.urls import path

from .views import NotificationListView, NotificationDetailView

urlpatterns = [
	path('api/notifications/', NotificationListView.as_view(), name='notifications'),
	path('api/notifications/<int:id>/', 
		NotificationDetailView.as_view(), name='notification-detail'),
]