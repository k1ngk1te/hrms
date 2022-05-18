from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination

from .models import Notification


class NotificationPagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		return Response(OrderedDict([
			('count', self.count),
			('next', self.get_next_link()),
			('previous', self.get_previous_link()),
			('results', data),
			('unread_count', self.get_unread_count(self.request.user))
		]))

	def get_unread_count(self, user):
		try:
			return Notification.objects.filter(recipient=user.employee, read=False).count()
		except:
			pass
		return 0