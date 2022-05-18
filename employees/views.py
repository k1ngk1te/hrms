import csv
import xlwt
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import get_instance
from .models import Department, Employee
from .pagination import EmployeePagination
from .permissions import IsHROrMD, IsHROrMDOrAdminUser
from .serializers import DepartmentSerializer, EmployeeSerializer

User = get_user_model()


class DepartmentListView(generics.ListCreateAPIView):
	permission_classes = (IsHROrMDOrAdminUser, )
	queryset = Department.objects.all().order_by('-id')
	serializer_class = DepartmentSerializer
	ordering_fields = ('name', 'hod__user__first_name', 'hod__user__last_name', 'hod__user__email')
	search_fields = ('name', 'hod__user__first_name', 'hod__user__last_name', 'hod__user__email')


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Department.objects.all()
	serializer_class = DepartmentSerializer
	lookup_field = 'id'
	permission_classes = (IsHROrMD, )

	def update(self, request, *args, **kwargs):
		instance = get_instance(Department, {"id": kwargs["id"]})
		if instance is None:
			return Response("department not found", status=status.HTTP_404_NOT_FOUND)
		serializer = self.get_serializer(instance, data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)
		if serializer.errors:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		return Response(serializer.data)


class EmployeeListView(generics.ListCreateAPIView):
	serializer_class = EmployeeSerializer
	pagination_class = EmployeePagination
	permission_classes = (IsHROrMDOrAdminUser, )
	ordering_fields = ('user__first_name', 'user__last_name', 'user__email')
	search_fields = ('user__first_name', 'user__last_name', 'user__email')

	def get_queryset(self):
		try:
			queryset = Employee.objects.employees(
				self.request.user.employee).order_by('-date_updated')
			return queryset
		except:
			pass
		return Employee.objects.none()


class EmployeeDetailView(generics.RetrieveUpdateAPIView):
	serializer_class = EmployeeSerializer
	permission_classes = (IsHROrMDOrAdminUser, )
	lookup_field = 'id'

	def put(self, request, *args, **kwargs):
		employee = self.get_object()
		serializer = self.get_serializer(employee, data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)
		if serializer.errors:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		return Response(serializer.data)

	def get_queryset(self):
		try:
			return Employee.objects.employees(self.request.user.employee)
		except:
			pass
		return Employee.objects.none()


class EmployeePasswordChangeView(APIView):
	permission_classes = (IsHROrMD, )
	
	def post(self, request, *args, **kwargs):
		email = self._validate_email(request.data.get("email"))
		password = self._validate_passwords(
			request.data.get("new_password1"), 
			request.data.get("new_password2"))

		user = get_instance(User, { "email": email })
		user.set_password(password)
		user.save()
		return Response({"detail": "password changed successfully"})
		
	def _validate_email(self, value):
		email = value.strip().lower()
		request_user = self.request.user
		user = get_instance(User, { "email": email })

		if user is None or user.employee is None:
			raise ValidationError("employee does not exist")

		if request_user.employee.is_hr and user.employee.is_md:
			raise PermissionDenied("You are forbidden from making this request")

		return email

	def _validate_passwords(self, password1, password2):
		if password1 is None or password1 == "":
			raise ValidationError({"new_password1": "This field is required"})
		if password2 is None or password2 == "":
			raise ValidationError({"new_password2": "This field is required"})
		if password1 != password2:
			raise ValidationError({
				"new_password1": "passwords do not match",
				"new_password2": "passwords do not match",
			})
		if len(password1) < 5:
			raise ValidationError({"new_password1": "Password must be more than 4 characters"})
		return password1


class EmployeeDeactivateView(APIView):
	permission_classes = (IsHROrMD, )

	def post(self, request, *args, **kwargs):
		admin = self._validate_user()
		user = self._validate_email(request.data.get("email", None))
		action = self._validate_action(request.data.get("action", None))
		if action == "deactivate":
			user.is_active = False
			user.employee.relinquish_status()
		elif action == "activate":
			user.is_active = True
		user.save()
		res_status = status.HTTP_200_OK
		if action == "activate":
			message = {
				"success": "Employee Activated Successfully"}
		elif action == "deactivate":
			message = {
				"success": "Employee De-activated Successfully"}
		else:
			message = "an error occurred"
			res_status = status.HTTP_400_BAD_REQUEST
		return Response(message, status=res_status)

	def _validate_email(self, email):
		if email is None:
			raise ValidationError({"email": "e-mail is required" })
		employee = get_instance(Employee, { "user__email": email })
		if employee is None:
			raise ValidationError({"email": "employee does not exist" })
		return employee.user

	def _validate_action(self, action):
		if action is None:
			raise ValidationError({"action": "action is required" })
		if action != "activate" and action != "deactivate":
			raise ValidationError({"action": "action is invalid. use activate or deactivate"})
			
		user = self._validate_email(self.request.data.get("email", None))

		if action == "deactivate" and user.is_active is False:
			raise ValidationError({"action": "employee is already deactivated"})
		if action == "activate" and user.is_active is True:
			raise ValidationError({"action": "employee is already activated"})
		return action

	def _validate_user(self):
		request_user = self.request.user
		user = self._validate_email(self.request.data.get("email", None))

		if (
			request_user.employee.is_hr is False and request_user.employee.is_md is False
		) or (
			request_user.employee.is_hr is True and user.employee.is_md is True
		):
			raise PermissionDenied("you are forbidden from making this request")
		
		if request_user == user:
			raise ValidationError("you cannot deactivate yourself")

		return request_user


class EmployeeExportDataView(APIView):
	permission_classes = (permissions.IsAdminUser, )

	def get(self, request, *args, **kwargs):
		file_type = kwargs["file_type"]
		if file_type == "csv":
			response = self.export_csv_data()
			return response
		elif file_type == "excel":
			response = self.export_excel_data()
			return response
		return Response(
			{"error": "invalid content type. can only export csv and excel file format."},
			status=status.HTTP_400_BAD_REQUEST)

	def export_csv_data(self):
		response = HttpResponse(content_type='text/csv',
			headers={'Content-Disposition': 'attachment; filename="employees.csv"'})
		writer = csv.writer(response)
		writer.writerow(self.get_emp_headers())
		
		employees = self.get_queryset()
		for emp in employees:
			writer.writerow(self.get_emp_data(emp))
		return response

	def export_excel_data(self):
		response = HttpResponse(content_type='application/ms-excel',
			headers={'Content-Disposition': 'attachment; filename="employees.xls"'})
		wb = xlwt.Workbook(encoding='utf-8')
		ws = wb.add_sheet('Employees')
		row_num = 0
		font_style = xlwt.XFStyle()
		font_style.font.bold = True

		columns = self.get_emp_headers()
		for col_num in range(len(columns)):
			ws.write(row_num, col_num, columns[col_num], font_style)
		font_style = xlwt.XFStyle()

		emps = self.get_queryset()
		for emp in emps:
			row_num += 1
			data = self.get_emp_data(emp)

			for col_num in range(len(data)):
				ws.write(row_num, col_num, str(data[col_num]), font_style)
		wb.save(response)
		return response

	def get_emp_headers(self):
		return ['First Name', 'Last Name', 'E-mail', 'Department', 'Job', 'Status', 
			'Supervisor Name', 'Supervisor E-mail', 'Date Employed']

	def get_emp_data(self, emp):
		try:
			return [
				emp.user.first_name, emp.user.last_name, emp.user.email, emp.department_name, 
				emp.job_name, emp.status, emp.get_supervisor("name"), 
				emp.get_supervisor("email"), str(emp.date_employed)
			]
		except:
			pass
		return []

	def get_queryset(self):
		try:
			name = self.request.query_params.get('name', None)
			queryset = Employee.objects.employees(
				self.request.user.employee).order_by('-date_updated')
			if name:
				queryset = queryset.filter(
					Q(user__first_name__icontains=name.lower()) | 
					Q(user__last_name__icontains=name.lower()) | 
					Q(user__email__icontains=name.lower()))
			status = self.request.query_params.get('status', None)
			if status:
				queryset = [x for x in queryset if x.status.lower() == status.lower()]
			return queryset
		except:
			pass
		return Employee.objects.none()

