from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination

from employees.models import Employee
from users.models import User
from .models import Leave


class LeavePagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('approved_count', self.get_status_count(self.request.user.employee, "A")),
				('count', self.count),
				('denied_count', self.get_status_count(self.request.user.employee, "D")),
				('next', self.get_next_link()),
				('pending_count', self.get_status_count(self.request.user.employee, "P")),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		except User.employee.RelatedObjectDoesNotExist:
			return Response(OrderedDict([
				('count', self.count),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		return None
		
	def get_status_count(self, employee, status):
		try:
			leave_count = 0
			for leave in Leave.objects.filter(employee=employee):
				if leave.status == status:
					leave_count += 1
			return leave_count
		except:
			pass
		return 0


class LeaveAdminPagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('approved_count', self.get_status_count(self.request.user.employee, "A")),
				('count', self.count),
				('denied_count', self.get_status_count(self.request.user.employee, "D")),
				('next', self.get_next_link()),
				('pending_count', self.get_status_count(self.request.user.employee, "P")),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		except User.employee.RelatedObjectDoesNotExist:
			return Response(OrderedDict([
				('count', self.count),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		return None

	def get_status_count(self, employee, status):
		try:
			leaves = Leave.admin_objects.leaves(employee)
			if employee.is_md:
				return leaves.filter(a_md=status).count()
			elif employee.is_hr:
				return leaves.filter(a_hr=status).count()
			elif employee.is_hod:
				return leaves.filter(a_hod=status).count()
			elif employee.is_supervisor:
				return leaves.filter(a_s=status).count()
			else:
				return 0
		except:
			pass
		return 0

