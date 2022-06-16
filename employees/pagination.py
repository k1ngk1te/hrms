from collections import OrderedDict
from rest_framework.response import Response

from core.pagination import CustomLimitOffsetPagination
from .models import Employee


class ClientPagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('active', queryset.filter(contact__is_active=True).count()),
			('count', self.count),
			('inactive', queryset.filter(contact__is_active=False).count()),
			('next', self.get_next_link()),
			('previous', self.get_previous_link()),
			('results', data),
		]))


class EmployeePagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('active', self.get_employee_count(self.request.user.employee, "active")),
			('count', self.count),
			('inactive', self.get_employee_count(self.request.user.employee, "inactive")),
			('on_leave', self.get_employee_count(self.request.user.employee, "on leave")),
			('next', self.get_next_link()),
			('previous', self.get_previous_link()),
			('results', data),
		]))

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


class ProjectPagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('count', self.count),
			('total', self.count),
			('completed', queryset.filter(completed=True).count()),
			('ongoing', queryset.filter(completed=False).count()),
			('next', self.get_next_link()),
			('previous', self.get_previous_link()),
			('results', data),
		]))


class TaskPagination(CustomLimitOffsetPagination):
	def get_paginated_response(self, data, queryset):
		return Response(OrderedDict([
			('project', self.get_project(queryset, self.count)),
			('total', self.count),
			('completed', queryset.filter(completed=True).count()),
			('ongoing', queryset.filter(completed=False).count()),
			('count', self.count),
			('next', self.get_next_link()),
			('previous', self.get_previous_link()),
			('results', data),
		]))

	def get_project(self, queryset, count):
		if not queryset or count <= 0:
			return None
		project = queryset.first().project
		return {
			"name": project.name,
			"id": project.id
		}
		
