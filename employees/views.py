import csv
import xlwt
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError, server_error
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import get_instance
from core.views import (
	ListCreateRetrieveUpdateView, 
	ListCreateRetrieveUpdateDestroyView
)
from .models import Attendance, Client, Department, Employee, Holiday
from .pagination import AttendancePagination, ClientPagination, EmployeePagination
from .permissions import IsEmployee, IsHROrMD, IsHROrMDOrAdminUser, IsHROrMDOrReadOnly
from .serializers import (
	AttendanceSerializer,
	ClientSerializer, 
	DepartmentSerializer, 
	EmployeeSerializer,
	HolidaySerializer,
)


User = get_user_model()


class AttendanceView(generics.ListCreateAPIView):
	pagination_class = AttendancePagination
	serializer_class = AttendanceSerializer
	permission_classes = (IsEmployee, )	

	def get(self, request, *args, **kwargs):
		print(request.user.employee.has_punched_out)
		return self.list(request, *args, **kwargs)

	def create(self, request, *args, **kwargs):
		serializer = AttendanceSerializer(data=request.data, context=self.get_serializer_context())
		serializer.is_valid(raise_exception=True)
		if serializer.errors:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		serializer.save()
		message = "Punched In"
		if request.data.get("action") == "out":
			message = "Punched Out"
		return Response({"detail": message}, status=status.HTTP_200_OK)

	def get_queryset(self):
		return Attendance.objects.filter(employee__user=self.request.user).order_by('-date')

	def get_serializer_context(self):
		return {
			'request': self.request,
			'format': self.format_kwarg,
			'view': self,
			'action': self.request.data.get("action", None)
		}


class ClientView(ListCreateRetrieveUpdateView):
	queryset = Client.objects.all().order_by('-id')
	pagination_class = ClientPagination
	permission_classes = (IsHROrMD, )
	serializer_class = ClientSerializer
	ordering_fields = ('contact__first_name', 'contact__last_name', 'company')
	search_fields = ('contact__first_name', 'contact__last_name', 'company')
	lookup_field = 'id'


class DepartmentView(ListCreateRetrieveUpdateDestroyView):
	permission_classes = (IsHROrMDOrAdminUser, )
	queryset = Department.objects.all().order_by('-id')
	serializer_class = DepartmentSerializer
	ordering_fields = ('name', 'hod__user__first_name', 'hod__user__last_name', 'hod__user__email')
	search_fields = ('name', 'hod__user__first_name', 'hod__user__last_name', 'hod__user__email')
	lookup_field = 'id'

	def put(self, request, *args, **kwargs):
		if request.user.employee.is_hr or request.user.employee.is_md:
			return self.custom_update(request, *args, **kwargs)
		return Response({"detail": "You are not authorized to make this request"}, 
			status=status.HTTP_403_FORBIDDEN)


class EmployeeView(ListCreateRetrieveUpdateView):
	serializer_class = EmployeeSerializer
	pagination_class = EmployeePagination
	permission_classes = (IsHROrMDOrAdminUser, )
	ordering_fields = ('user__first_name', 'user__last_name', 'user__email')
	search_fields = ('user__first_name', 'user__last_name', 'user__email')
	lookup_field = 'id'

	def get_queryset(self):
		try:
			queryset = Employee.objects.employees(
				self.request.user.employee).order_by('-date_updated')
			return queryset
		except:
			pass
		return Employee.objects.none()


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


# Use Allauth Get adapter validate password to do this
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
		return Response({"detail": "Password Changed Successfully"})
		
	def _validate_email(self, value):
		email = value.strip().lower()
		request_user = self.request.user
		user = get_instance(User, { "email": email })

		form_type = self.request.data.get("type")
		if form_type and form_type == "client":
			if user is None or user.client is None:
				raise ValidationError("client does not exist")
		else:
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
		_type = self.request.data.get("type", None)
		if action == "deactivate":
			user.is_active = False
			if _type is None or _type != "client":
				user.employee.relinquish_status()
		elif action == "activate":
			user.is_active = True
		user.save()
		res_status = status.HTTP_200_OK
		user_type = "employee"
		if _type == "client":
			user_type = "client"
		if action == "activate":
			message = {
				"detail": f"{user_type.capitalize()} Activated Successfully", "type": user_type}
		elif action == "deactivate":
			message = {
				"detail": f"{user_type.capitalize()} De-activated Successfully", "type": user_type}
		else:
			message = {"detail", "A server error occurred! Please try again later."}
			res_status = status.HTTP_400_BAD_REQUEST
		return Response(message, status=res_status)

	def _validate_email(self, email):
		if email is None:
			raise ValidationError({"detail": "e-mail is required" })
		_type = self.request.data.get("type", None)
		if _type == "client":
			client = get_instance(Client, { "contact__email": email })
			if client is None:
				raise ValidationError({"detail": "client does not exist" })
			return client.contact
		employee = get_instance(Employee, { "user__email": email })
		if employee is None:
			raise ValidationError({"detail": "employee does not exist" })
		return employee.user

	def _validate_action(self, action):
		if action is None:
			raise ValidationError({"detail": "action is required" })
		if action != "activate" and action != "deactivate":
			raise ValidationError({"detail": "action is invalid. use activate or deactivate"})
			
		user = self._validate_email(self.request.data.get("email", None))
		_type = self.request.data.get("type", None)

		if action == "deactivate" and user.is_active is False:
			if _type == "client":
				raise ValidationError({"detail": "client is already inactive"})
			raise ValidationError({"detail": "employee is already inactive"})
		if action == "activate" and user.is_active is True:
			if _type == "client":
				raise ValidationError({"detail": "client is already active"})
			raise ValidationError({"detail": "employee is already active"})
		return action

	def _validate_user(self):
		request_user = self.request.user
		user = self._validate_email(self.request.data.get("email", None))

		if (
			request_user.employee.is_hr is False and request_user.employee.is_md is False
		) or (
			request_user.employee.is_hr is True and user.employee.is_md is True
		):
			raise PermissionDenied({"detail": "you are forbidden from making this request"})
		
		if request_user == user:
			raise ValidationError({"detail": "you cannot deactivate yourself"})

		return request_user


class HolidayView(ListCreateRetrieveUpdateDestroyView):
	queryset = Holiday.objects.all().order_by('-date')
	permission_classes = (IsHROrMDOrReadOnly, )
	serializer_class = HolidaySerializer
	ordering_fields = ('-date', 'name')
	search_fields = ('name', )
	lookup_field = 'id'