from collections import OrderedDict
from rest_framework.response import Response

from core.pagination import CustomLimitOffsetPagination


class LeavePagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('approved_count', self.get_status_count(queryset, "A")),
			('count', self.count),
			('denied_count', self.get_status_count(queryset, "D")),
			('next', self.get_next_link()),
			('pending_count', self.get_status_count(queryset, "P")),
			('previous', self.get_previous_link()),
			('results', data),
		]))
		
	def get_status_count(self, queryset, status):
		try:
			leave_count = 0
			for leave in queryset:
				if leave.status == status:
					leave_count += 1
			return leave_count
		except:
			pass
		return 0


class LeaveAdminPagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('approved_count', self.get_status_count(queryset, "A")),
			('count', self.count),
			('denied_count', self.get_status_count(queryset, "D")),
			('next', self.get_next_link()),
			('pending_count', self.get_status_count(queryset, "P")),
			('previous', self.get_previous_link()),
			('results', data),
		]))

	def get_status_count(self, queryset, status):
		try:
			employee = self.request.user.employee
			if employee.is_md:
				return queryset.filter(a_md=status).count()
			elif employee.is_hr:
				return queryset.filter(a_hr=status).count()
			elif employee.is_hod:
				return queryset.filter(a_hod=status).count()
			elif employee.is_supervisor:
				return queryset.filter(a_s=status).count()
			else:
				return 0
		except:
			pass
		return 0


class OvertimePagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('approved_count', self.get_status_count(queryset, "A")),
			('count', self.count),
			('denied_count', self.get_status_count(queryset, "D")),
			('next', self.get_next_link()),
			('pending_count', self.get_status_count(queryset, "P")),
			('previous', self.get_previous_link()),
			('results', data),
		]))
		
	def get_status_count(self, queryset, status):
		try:
			overtime_count = 0
			for overtime in queryset:
				if overtime.status == status:
					overtime_count += 1
			return overtime_count
		except:
			pass
		return 0


class OvertimeAdminPagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('approved_count', self.get_status_count(queryset, "A")),
			('count', self.count),
			('denied_count', self.get_status_count(queryset, "D")),
			('next', self.get_next_link()),
			('pending_count', self.get_status_count(queryset, "P")),
			('previous', self.get_previous_link()),
			('results', data),
		]))

	def get_status_count(self, queryset, status):
		try:
			employee = self.request.user.employee
			if employee.is_md:
				return queryset.filter(a_md=status).count()
			elif employee.is_hr:
				return queryset.filter(a_hr=status).count()
			elif employee.is_hod:
				return queryset.filter(a_hod=status).count()
			elif employee.is_supervisor:
				return queryset.filter(a_s=status).count()
			else:
				return 0
		except:
			pass
		return 0

