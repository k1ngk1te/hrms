from django.db.models import Q
from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination

from users.models import User
from .models import Client, Employee, Project, Task


class AttendancePagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('count', self.count),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('punched_in', self.request.user.employee.has_punched_in),
				('punched_out', self.request.user.employee.has_punched_out),
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
			return Response(OrderedDict([
				('count', self.count),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
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


class ProjectPagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('count', self.count),
				('total', self.get_filtered_count()),
				('completed', self.get_filtered_count(completed=True)),
				('verified', self.get_filtered_count(verified=True)),
				('ongoing', self.get_ongoing_count()),
				('inactive', self.get_inactive_count()),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		except:
			return Response(OrderedDict([
				('count', self.count),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		return None

	def get_filtered_count(self, **kwargs):
		return self.get_projects().filter(**kwargs).count()

	def get_ongoing_count(self):
		projects = self.get_projects().filter(verified=False, completed=False)
		ongoing = [x for x in projects if x.is_active is True]
		return len(ongoing)

	def get_inactive_count(self):
		projects = self.get_projects().filter(verified=False, completed=False)
		ongoing = [x for x in projects if x.is_active is False]
		return len(ongoing)

	def get_projects(self):
		user = self.request.user
		if not user.is_client and not user.is_employee:
			return Project.objects.none()
		if user.is_client:
			queryset = Project.objects.filter(client__contact=user).distinct()
		if user.is_employee and (user.employee.is_hr or user.employee.is_md):
			queryset = Project.objects.all().distinct()
		else:
			queryset = Project.objects.filter(Q(created_by__user=user) | Q(team=user.employee)).distinct()
		return queryset


class TaskPagination(LimitOffsetPagination):
	def get_paginated_response(self, data):
		try:
			return Response(OrderedDict([
				('project', self.get_project()),
				('total', Task.objects.all().count()),
				('completed', Task.objects.filter(completed=True).count()),
				('verified', Task.objects.filter(verified=True).count()),
				('count', self.count),
				('ongoing', Task.objects.filter(completed=False).count()),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		except:
			return Response(OrderedDict([
				('count', self.count),
				('next', self.get_next_link()),
				('previous', self.get_previous_link()),
				('results', data),
			]))
		return None

	def get_project(self):
		kwargs = self.request.parser_context.get("kwargs", None)
		project_id = kwargs.get("project_id", None)
		try:
			project = Project.objects.get(id=project_id)
			return {
				"name": project.name,
				"id": project.id
			}
		except:
			pass
		return None
		
