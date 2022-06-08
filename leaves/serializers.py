from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError

from common.serializer_fields import CustomChoiceField
from common.utils import get_instance, get_user_info, get_leave_type, get_overtime_type
from employees.models import Employee
from .models import Leave, Overtime


def get_status(status):
	if status == "A":
		return "approved"
	elif status == "D":
		return "denied"
	elif status == "P":
		return "pending"
	elif status == "E":
		return "expired"
	else:
		return "not needed"

class LeaveSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	leave_type = CustomChoiceField(get_leave_type)
	user = serializers.SerializerMethodField('get_user')
	status = serializers.SerializerMethodField('get_status')
	resume_date = serializers.SerializerMethodField('get_resume_date')
	no_of_days = serializers.SerializerMethodField('get_no_of_days')
	authorized = serializers.SerializerMethodField('get_authorized')
	completed = serializers.SerializerMethodField('get_completed')
	date_updated = serializers.DateTimeField(read_only=True)
	date_requested = serializers.DateTimeField(read_only=True)

	class Meta:
		model = Leave
		fields = (
			'id', 'user', 'leave_type', 'status', 'start_date', 'end_date', 'resume_date',
			'no_of_days', 'completed', 'reason', 'authorized', 'date_updated', 'date_requested'
		)

	def create(self, validated_data):
		request = self.context.get("request")
		employee = get_instance(Employee, {"user": request.user})
		if employee is None:
			raise ValidationError("Employee Does Not Exist")
		leave = Leave.objects.create(employee=employee, created_by=employee, **validated_data)
		return leave

	def get_no_of_days(self, obj):
		return obj.no_of_days

	def get_status(self,obj):
		return get_status(obj.status)

	def get_completed(self,obj):
		return obj.completed

	def get_resume_date(self,obj):
		return obj.resume_date

	def get_user(self, obj):
		user = obj.employee.user
		request = self.context.get("request")
		data = get_user_info(user, request)
		return data

	def get_authorized(self, obj):
		return {
			"supervisor": get_status(obj.a_s),
			"hod": get_status(obj.a_hod),
			"hr": get_status(obj.a_hr),
			"md": get_status(obj.a_md)
		}


class LeaveAdminSerializer(LeaveSerializer):
	admin_status = serializers.SerializerMethodField('get_admin_status')
	employee = serializers.CharField()

	class Meta:
		model = LeaveSerializer.Meta.model
		fields = LeaveSerializer.Meta.fields + ('admin_status', 'employee')

	def create(self, validated_data):
		request = self.context.get("request")
		employee = validated_data.pop("employee")

		if employee is None:
			raise ValidationError({"employee": "employee does not exist"})

		admin = get_instance(Employee, {"user__email": request.user.email})
		if admin is None:
			raise PermissionDenied({"error": "Admin did not approve this request"})
		
		if employee.supervisor == admin or (
			employee.department == admin.department and admin.is_hod is True
			) or admin.is_hr is True or admin.is_md is True:
			leave = Leave.admin_objects.create(
				employee=employee, created_by=admin, **validated_data)
			return leave
		raise PermissionDenied({
			"error": "You are not allowed to perform this request for this employee."
			})

	def validate_employee(self, value):
		if not value:
			raise ValidationError("Employee ID is required!")
		if isinstance(value, str) is False:
			raise ValidationError("Employee ID must be a string!")
		employee = get_instance(Employee, {"id": value})
		if not employee:
			raise ValidationError(f"Employee with specified ID {value} does not exist!")
		return employee

	def get_admin_status(self, obj):
		user = self.context.get("request").user
		if user is None:
			return None
		employee = get_instance(Employee, {"user": user})
		if employee is None:
			return None
		if employee.is_md is True:
			if obj.a_md == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_md)
		if employee.is_hr is True:
			if obj.a_hr == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_hr)
		if employee.is_hod is True:
			if obj.a_hod == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_hod)
		if employee.is_supervisor is True:
			if obj.a_s == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_s)
		return None


class OvertimeSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	overtime_type = CustomChoiceField(get_overtime_type)
	user = serializers.SerializerMethodField('get_user')
	status = serializers.SerializerMethodField('get_status')
	authorized = serializers.SerializerMethodField('get_authorized')
	date_updated = serializers.DateTimeField(read_only=True)
	date_requested = serializers.DateTimeField(read_only=True)

	class Meta:
		model = Overtime
		fields = (
			'id', 'user', 'overtime_type', 'status', 'date', 'hours',
			'reason', 'authorized', 'date_updated', 'date_requested'
		)

	def create(self, validated_data):
		request = self.context.get("request")
		employee = get_instance(Employee, {"user": request.user})
		if employee is None:
			raise ValidationError("Employee Does Not Exist")
		overtime = Overtime.objects.create(employee=employee, created_by=employee, **validated_data)
		return overtime

	def get_status(self,obj):
		return get_status(obj.status)

	def get_user(self, obj):
		user = obj.employee.user
		request = self.context.get("request")
		data = get_user_info(user, request)
		return data

	def get_authorized(self, obj):
		return {
			"supervisor": get_status(obj.a_s),
			"hod": get_status(obj.a_hod),
			"hr": get_status(obj.a_hr),
			"md": get_status(obj.a_md)
		}


class OvertimeAdminSerializer(OvertimeSerializer):
	admin_status = serializers.SerializerMethodField('get_admin_status')
	employee = serializers.CharField()

	class Meta:
		model = OvertimeSerializer.Meta.model
		fields = OvertimeSerializer.Meta.fields + ('admin_status', 'employee')

	def create(self, validated_data):
		request = self.context.get("request")
		employee = validated_data.pop("employee")

		if employee is None:
			raise ValidationError({"employee": "employee does not exist"})

		admin = get_instance(Employee, {"user__email": request.user.email})
		if admin is None:
			raise PermissionDenied({"error": "Admin did not approve this request"})
		
		if employee.supervisor == admin or (
			employee.department == admin.department and admin.is_hod is True
			) or admin.is_hr is True or admin.is_md is True:
			overtime = Overtime.admin_objects.create(
				employee=employee, created_by=admin, **validated_data)
			return overtime
		raise PermissionDenied({
			"error": "You are not allowed to perform this request for this employee."
			})

	def validate_employee(self, value):
		if not value:
			raise ValidationError("Employee ID is required!")
		if isinstance(value, str) is False:
			raise ValidationError("Employee ID must be a string!")
		employee = get_instance(Employee, {"id": value})
		if not employee:
			raise ValidationError(f"Employee with specified ID {value} does not exist!")
		return employee

	def get_admin_status(self, obj):
		user = self.context.get("request").user
		if user is None:
			return None
		employee = get_instance(Employee, {"user": user})
		if employee is None:
			return None
		if employee.is_md is True:
			if obj.a_md == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_md)
		if employee.is_hr is True:
			if obj.a_hr == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_hr)
		if employee.is_hod is True:
			if obj.a_hod == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_hod)
		if employee.is_supervisor is True:
			if obj.a_s == "P" and obj.status == "E":
				return get_status("E")
			return get_status(obj.a_s)
		return None

