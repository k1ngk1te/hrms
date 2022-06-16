from rest_framework import generics

from core.views import ListView
from .models import Notification
from .pagination import NotificationPagination
from .serializers import NotificationSerializer


class NotificationListView(ListView):
	serializer_class = NotificationSerializer
	pagination_class = NotificationPagination

	def get_queryset(self):
		return Notification.objects.filter(
			recipient=self.request.user.employee).order_by('-date_sent')


class NotificationDetailView(generics.DestroyAPIView):
	serializer_class = NotificationSerializer
	lookup_field = "id"
	
	def get_queryset(self):
		return Notification.objects.filter(recipient=self.request.user.employee)
