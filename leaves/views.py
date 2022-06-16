import csv
import xlwt
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import HttpResponse
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import get_instance, get_instances
from core.views import ListCreateRetrieveView
from employees.models import Employee
from employees.permissions import IsEmployee
from notifications.models import Notification
from .models import Leave, Overtime
from .pagination import (
	LeavePagination, 
	LeaveAdminPagination,
	OvertimePagination,
	OvertimeAdminPagination
)
from .serializers import (
	LeaveSerializer, 
	LeaveAdminSerializer,
	OvertimeSerializer,
	OvertimeAdminSerializer
)
from .utils import send_leave_email, send_overtime_email

User = get_user_model()


class LeaveView(ListCreateRetrieveView):
	permission_classes = (IsEmployee, )
	serializer_class = LeaveSerializer
	pagination_class = LeavePagination
	lookup_field = 'id'

	def get(self, request, *args, **kwargs):
		leave_id = kwargs.get('id', None)
		if not leave_id:
			return self.list(request, *args, **kwargs)
		leave = get_instance(Leave, {"id": leave_id})
		if leave is None:
			return Response({"detail": "Leave with specified ID was not found!"}, 
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
		raise PermissionDenied({"detail": "You are not authorized to view this information"})

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


class LeaveAdminView(ListCreateRetrieveView):
	serializer_class = LeaveAdminSerializer
	pagination_class = LeaveAdminPagination
	permission_classes = (permissions.IsAdminUser, )
	ordering_fields = ('employee__user__first_name', 'employee__user__last_name', 'employee__user__email')
	search_fields = ('employee__user__first_name', 'employee__user__last_name', 'employee__user__email')
	lookup_field = 'id'


	def patch(self, request, *args, **kwargs):
		leave_id = kwargs.get("id", None)
		if not leave_id:
			raise ValidationError({"detail": "Leave ID is required!"})
		leave = get_instance(Leave, {"id": leave_id})
		if leave is None:
			return Response({"detail": "Leave with specified ID was not found!"}, 
				status=status.HTTP_404_NOT_FOUND)
		authorized = Leave.objects.can_view_leave(leave, request.user.employee)
		if authorized is False:
			raise PermissionDenied({"detail": "you are not authorized to make this request"})
		approval = self._validate_approval(request.data.get("approval", None))
		[can_amend, reason] = Leave.admin_objects.can_amend_leave(request.user.employee, leave)
		if can_amend:
			serializer = self._perform_action(approval, leave)
			if approval == "A":
				self._send_leave_email(leave, "A")
				return Response({"detail": "Leave request is Approved"}, status=status.HTTP_200_OK)
			elif approval == "D":
				self._send_leave_email(leave, "D")
				return Response({"detail": "Leave request is Denied"}, status=status.HTTP_200_OK)
			return Response({"detail": "something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
		return Response({"detail": reason}, status=status.HTTP_400_BAD_REQUEST)

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
			raise ValidationError({"detail": "approval is required"})
		if approval != "approved" and approval != "denied":
			raise ValidationError({"detail": "approval is invalid! Specify 'approved' or 'denied' "})
		if approval == "approved":
			return "A"
		elif approval == "denied":
			return "D"
		return "P"

	def _send_leave_email(self, leave, approval):
		emp = self.request.user.employee
		[position, to] = self._get_position(emp, leave)
		send_leave_email(approval, emp, leave, to, position)

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
			{"detail": "invalid content type. can only export csv and excel file format."},
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


class OvertimeView(ListCreateRetrieveView):
	permission_classes = (IsEmployee, )
	serializer_class = OvertimeSerializer
	pagination_class = OvertimePagination
	lookup_field = 'id'

	def get(self, request, *args, **kwargs):
		overtime_id = kwargs.get('id', None)
		if not overtime_id:
			return self.list(request, *args, **kwargs)
		overtime = get_instance(Overtime, {"id": overtime_id})
		if overtime is None:
			return Response({"detail": "Overtime with specified ID was not found!"}, 
				status=status.HTTP_404_NOT_FOUND)
		authorized = Overtime.objects.can_view_overtime(overtime, request.user.employee)
		if authorized is True:
			serializer = OvertimeSerializer(overtime, context={"request": request})
			try:
				notifications = get_instances(Notification, {"message_id": overtime.id,"read": False,
					"recipient": request.user.employee, "_type": "O"})
				if notifications is not None:
					for note in notifications:
						note.read = True
						note.save()
			except:
				pass
			return Response(serializer.data, status=status.HTTP_200_OK)
		raise PermissionDenied({"detail": "You are not authorized to view this information"})

	def get_queryset(self):
		try:
			_from = self.request.query_params.get("from", None)
			_to = self.request.query_params.get("to", None)
			if _from is not None and _from != "":
				return Overtime.objects.filter_by_date(self.request.user.employee, _from, _to).order_by(
					'-date_requested')
			return Overtime.objects.filter(
				employee=self.request.user.employee).order_by('-date_requested')
		except User.employee.RelatedObjectDoesNotExist:
			pass
		return Overtime.objects.none()


class OvertimeAdminView(ListCreateRetrieveView):
	serializer_class = OvertimeAdminSerializer
	pagination_class = OvertimeAdminPagination
	permission_classes = (permissions.IsAdminUser, )
	ordering_fields = ('employee__user__first_name', 'employee__user__last_name', 'employee__user__email')
	search_fields = ('employee__user__first_name', 'employee__user__last_name', 'employee__user__email')
	lookup_field = 'id'


	def patch(self, request, *args, **kwargs):
		overtime_id = kwargs.get("id", None)
		if not overtime_id:
			raise ValidationError({"detail": "Overtime ID is required!"})
		overtime = get_instance(Overtime, {"id": overtime_id})
		if overtime is None:
			return Response({"detail": "Overtime with specified ID was not found!"}, 
				status=status.HTTP_404_NOT_FOUND)
		authorized = Overtime.objects.can_view_overtime(overtime, request.user.employee)
		if authorized is False:
			raise PermissionDenied({"detail": "You are not authorized to make this request"})
		approval = self._validate_approval(request.data.get("approval", None))
		[can_amend, reason] = Overtime.admin_objects.can_amend_overtime(request.user.employee, overtime)
		if can_amend:
			serializer = self._perform_action(approval, overtime)
			if approval == "A":
				self._send_overtime_email(overtime, "A")
				return Response({"detail": "Overtime request is Approved"}, status=status.HTTP_200_OK)
			elif approval == "D":
				self._send_overtime_email(overtime, "D")
				return Response({"detail": "Overtime request is Denied"}, status=status.HTTP_200_OK)
			return Response({"detail": "something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
		return Response({"detail": reason}, status=status.HTTP_400_BAD_REQUEST)

	def _perform_action(self, approval, overtime):
		employee = self.request.user.employee
		if employee.is_md:
			overtime.a_md = approval
			overtime.save()
		elif employee.is_hr:
			overtime.a_hr = approval
			overtime.save()
		elif employee.is_hod:
			overtime.a_hod = approval
			overtime.save()
		elif employee.is_supervisor:
			overtime.a_s = approval
			overtime.save()
		return overtime

	def _validate_approval(self, approval):
		if approval is None:
			raise ValidationError({"detail": "approval is required"})
		if approval != "approved" and approval != "denied":
			raise ValidationError({"detail": "approval is invalid! Specify 'approved' or 'denied' "})
		if approval == "approved":
			return "A"
		elif approval == "denied":
			return "D"
		return "P"

	def _send_overtime_email(self, overtime, approval):
		emp = self.request.user.employee
		[position, to] = self._get_position(emp, overtime)
		send_overtime_email(approval, emp, overtime, to, position)

	def _get_position(self, emp, overtime):
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
			if overtime.employee.department.hod:
				to = overtime.employee.department.hod
			else:
				to = Employee.objects.filter(is_hr=True).first()
		return [position, to]

	def get_queryset(self):
		try:
			queryset = Overtime.admin_objects.overtimes(
				self.request.user.employee).order_by('-date_requested')
			_from = self.request.query_params.get("from", None)
			_to = self.request.query_params.get("to", None)
			if _from is not None and _from != "":
				queryset = Overtime.admin_objects.filter_by_date(self.request.user.employee, 
					_from, _to).order_by('-date_requested')
			return queryset
		except User.employee.RelatedObjectDoesNotExist:
			pass
		return Overtime.objects.none()


class OvertimeExportDataView(APIView):
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
			{"detail": "invalid content type. can only export csv and excel file format."},
			status=status.HTTP_400_BAD_REQUEST)

	def export_csv_data(self):
		response = HttpResponse(content_type='text/csv',
			headers={'Content-Disposition': 'attachment; filename="overtime.csv"'})
		writer = csv.writer(response)
		writer.writerow(self.get_overtime_headers())
		
		overtime = self.get_queryset()
		for ov in overtime:
			writer.writerow(self.get_overtime_data(ov))
		return response

	def export_excel_data(self):
		response = HttpResponse(content_type='application/ms-excel',
			headers={'Content-Disposition': 'attachment; filename="overtime.xls"'})
		wb = xlwt.Workbook(encoding='utf-8')
		ws = wb.add_sheet('Overtime')
		row_num = 0
		font_style = xlwt.XFStyle()
		font_style.font.bold = True

		columns = self.get_overtime_headers()
		for col_num in range(len(columns)):
			ws.write(row_num, col_num, columns[col_num], font_style)
		font_style = xlwt.XFStyle()

		overtime = self.get_queryset()
		for ov in overtime:
			row_num += 1
			data = self.get_overtime_data(ov)

			for col_num in range(len(data)):
				ws.write(row_num, col_num, str(data[col_num]), font_style)
		wb.save(response)
		return response

	def get_overtime_headers(self):
		return ['First Name', 'Last Name', 'E-mail', 'Overtime Type', 'Date', 'Hours', 
			'Reason', 'Created By', 'Status', 'Date Requested']

	def get_overtime_data(self, overtime):
		try:
			return [
				overtime.employee.user.first_name, overtime.employee.user.last_name, 
				overtime.employee.user.email, overtime.overtime_type_name, str(overtime.date),
				str(overtime.hours), overtime.reason, overtime.created_by.user.get_full_name(), 
				overtime.get_admin_status(self.request.user.employee, True), overtime.date_requested
			]
		except:
			pass
		return []

	def get_queryset(self):
		try:
			queryset = Overtime.admin_objects.overtimes(
				self.request.user.employee).order_by('-date_requested')
			_from = self.request.query_params.get("from")
			if _from is not None and _from != "":
				queryset = Overtime.admin_objects.filter_by_date(self.request.user.employee, 
					_from).order_by('-date_requested')
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
		return Overtime.objects.none()

