from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination

from users.models import User
from .models import Client, Employee


class ClientPagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('active', Client.objects.filter(contact__is_active=True).count()),
				('count', self.count),
				('inactive', Client.objects.filter(contact__is_active=False).count()),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		except:
			pass
		return None


class EmployeePagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('active', self.get_employee_count(self.request.user.employee, "active")),
				('count', self.count),
				('inactive', self.get_employee_count(self.request.user.employee, "inactive")),
				('on_leave', self.get_employee_count(self.request.user.employee, "on leave")),
				('next', self.get_next_link()),
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

	def get_employee_count(self, employee, status):
		try:
			emp_count = 0
			for emp in Employee.objects.employees(employee):
				if emp.status.lower() == status:
					emp_count += 1
			return emp_count
		except:
			pass
		return 0

