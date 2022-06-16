from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination


class CustomLimitOffsetPagination(LimitOffsetPagination):
	# Use to pass in the queryset in get_paginated_response

	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('count', self.count),
			('next', self.get_next_link()),
			('previous', self.get_previous_link()),
			('results', data),
		]))

