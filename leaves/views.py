import csv
import xlwt
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import get_instance, get_instances
from employees.models import Employee
from employees.permissions import IsEmployee
from notifications.models import Notification
from .models import Leave
from .pagination import LeavePagination, LeaveAdminPagination
from .serializers import LeaveSerializer, LeaveAdminSerializer
from .utils import send_email

User = get_user_model()


class LeaveListView(generics.ListCreateAPIView):
	permission_classes = (IsEmployee, )
	serializer_class = LeaveSerializer
	pagination_class = LeavePagination

	def get_queryset(self):
		try:
			_from = self.request.query_params.get("from")
			_to = self.request.query_params.get("to")
			if _from is not None and _to is not None and _from != "" and _to != "":
				return Leave.objects.filter_by_date(self.request.user.employee, _from, _to).order_by(
					'-date_requested')
			return Leave.objects.filter(
				employee=self.request.user.employee).order_by('-date_requested')
		except User.employee.RelatedObjectDoesNotExist:
			pass
		return Leave.objects.none()


class LeaveDetailView(APIView):
	permission_classes = (IsEmployee, )
	
	def get(self, request, *args, **kwargs):
		leave = get_instance(Leave, {"id": kwargs['id']})
		if leave is None:
			return Response("Leave with specified ID was not found!", 
				status=status.HTTP_404_NOT_FOUND)
		authorized = Leave.objects.can_view_leave(leave, request.user.employee)
		if authorized is True:
			serializer = LeaveSerializer(leave, context={"request": request})
			try:
				notifications = get_instances(Notification, {"message_id": leave.id,"read": False,
					"recipient": request.user.employee, "_type": "L"})
				if notifications is not None:
					for note in notifications:
						note.read = True
						note.save()
			except:
				pass
			return Response(serializer.data, status=status.HTTP_200_OK)
		raise PermissionDenied("You are not authorized to view this information")

	
class LeaveAdminListView(generics.ListCreateAPIView):
	serializer_class = LeaveAdminSerializer
	pagination_class = LeaveAdminPagination
	permission_classes = (permissions.IsAdminUser, )
	ordering_fields = ('employee__user__first_name', 'employee__user__last_name', 'employee__user__email')
	search_fields = ('employee__user__first_name', 'employee__user__last_name', 'employee__user__email')

	def get_queryset(self):
		try:
			queryset = Leave.admin_objects.leaves(
				self.request.user.employee).order_by('-date_requested')
			_from = self.request.query_params.get("from")
			_to = self.request.query_params.get("to")
			if _from is not None and _to is not None and _from != "" and _to != "":
				queryset = Leave.admin_objects.filter_by_date(self.request.user.employee, 
					_from, _to).order_by('-date_requested')
			return queryset
		except User.employee.RelatedObjectDoesNotExist:
			pass
		return Leave.objects.none()
	

class LeaveAdminDetailView(APIView):
	permission_classes = (permissions.IsAdminUser, )
	
	def patch(self, request, *args, **kwargs):
		leave = get_instance(Leave, {"id": kwargs["id"]})
		if leave is None:
			return Response("Leave with specified ID was not found!", 
				status=status.HTTP_404_NOT_FOUND)
		authorized = Leave.objects.can_view_leave(leave, request.user.employee)
		if authorized is False:
			raise PermissionDenied("you are not authorized to make this request")
		approval = self._validate_approval(request.data.get("approval", None))
		[can_amend, reason] = Leave.admin_objects.can_amend_leave(request.user.employee, leave)
		if can_amend:
			serializer = self._perform_action(approval, leave)
			if approval == "A":
				self._send_email(leave, "A")
				return Response("Leave request is Approved", status=status.HTTP_200_OK)
			elif approval == "D":
				self._send_email(leave, "D")
				return Response("Leave request is Denied", status=status.HTTP_200_OK)
			return Response("something went wrong", status=status.HTTP_400_BAD_REQUEST)
		return Response(reason, status=status.HTTP_400_BAD_REQUEST)

	def _perform_action(self, approval, leave):
		employee = self.request.user.employee
		if employee.is_md:
			leave.a_md = approval
			leave.save()
		elif employee.is_hr:
			leave.a_hr = approval
			leave.save()
		elif employee.is_hod:
			leave.a_hod = approval
			leave.save()
		elif employee.is_supervisor:
			leave.a_s = approval
			leave.save()
		return leave

	def _validate_approval(self, approval):
		if approval is None:
			raise ValidationError("approval is required")
		if approval != "approved" and approval != "denied":
			raise ValidationError("approval is invalid!")
		if approval == "approved":
			return "A"
		elif approval == "denied":
			return "D"
		return "P"

	def _send_email(self, leave, approval):
		emp = self.request.user.employee
		[position, to] = self._get_position(emp, leave)
		send_email(approval, emp, leave, to, position)

	def _get_position(self, emp, leave):
		to = None
		if emp.is_md:
			position = "the Managing Director"
		elif emp.is_hr:
			position = "the Human Resource Manager"
			to = Employee.objects.filter(is_md=True).first()
		elif emp.is_hod:
			position = "the Head Of Department"
			to = Employee.objects.filter(is_hr=True).first()
		else:
			position = "the/your Supervisor"
			if leave.employee.department.hod:
				to = leave.employee.department.hod
			else:
				to = Employee.objects.filter(is_hr=True).first()
		return [position, to]


class LeaveExportDataView(APIView):
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
			headers={'Content-Disposition': 'attachment; filename="leaves.csv"'})
		writer = csv.writer(response)
		writer.writerow(self.get_leave_headers())
		
		leaves = self.get_queryset()
		for leave in leaves:
			writer.writerow(self.get_leave_data(leave))
		return response

	def export_excel_data(self):
		response = HttpResponse(content_type='application/ms-excel',
			headers={'Content-Disposition': 'attachment; filename="leaves.xls"'})
		wb = xlwt.Workbook(encoding='utf-8')
		ws = wb.add_sheet('Leaves')
		row_num = 0
		font_style = xlwt.XFStyle()
		font_style.font.bold = True

		columns = self.get_leave_headers()
		for col_num in range(len(columns)):
			ws.write(row_num, col_num, columns[col_num], font_style)
		font_style = xlwt.XFStyle()

		leaves = self.get_queryset()
		for leave in leaves:
			row_num += 1
			data = self.get_leave_data(leave)

			for col_num in range(len(data)):
				ws.write(row_num, col_num, str(data[col_num]), font_style)
		wb.save(response)
		return response

	def get_leave_headers(self):
		return ['First Name', 'Last Name', 'E-mail', 'Leave Type', 'Start Date', 'End Date', 
			'Resumption Date', 'Number Of Days', 'Reason', 'Created By', 'Status', 
			'Date Requested']

	def get_leave_data(self, leave):
		try:
			return [
				leave.employee.user.first_name, leave.employee.user.last_name, 
				leave.employee.user.email, leave.leave_type_name, str(leave.start_date),
				str(leave.end_date), str(leave.resume_date), leave.no_of_days, leave.reason,
				leave.created_by.user.get_full_name(), 
				leave.get_admin_status(self.request.user.employee, True), leave.date_requested
			]
		except:
			pass
		return []

	def get_queryset(self):
		try:
			queryset = Leave.admin_objects.leaves(
				self.request.user.employee).order_by('-date_requested')
			_from = self.request.query_params.get("from")
			_to = self.request.query_params.get("to")
			if _from is not None and _to is not None and _from != "" and _to != "":
				queryset = Leave.admin_objects.filter_by_date(self.request.user.employee, 
					_from, _to).order_by('-date_requested')
			name = self.request.query_params.get("name")
			if name is not None and name != "":
				queryset = queryset.filter(
					Q(employee__user__first_name__icontains=name) |
					Q(employee__user__last_name__icontains=name) |
					Q(employee__user__email__icontains=name)
				)
			status = self.request.query_params.get('status', None)
			if status:
				queryset = [x for x in queryset if x.get_admin_status(
					self.request.user.employee, True) == status.lower()]
			return queryset
		except User.employee.RelatedObjectDoesNotExist:
			pass
		return Leave.objects.none()


