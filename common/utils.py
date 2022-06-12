from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError


User = get_user_model()


def get_request_method(context):
	try:
		method = context["request"].method
		return method
	except:
		return None

def get_profile_image(user, request=None):
	try:
		if bool(user.profile.image) is True:
			if request is not None:
				return request.build_absolute_uri(user.profile.image.url)
			else:
				return user.profile.image.url
		return None
	except:
		return None

def get_anonymous_user():
	user = User.objects.get_or_create(
		email="anonymous@unifoamhr.com",
		first_name="Anonymous", last_name="Anonymous"
	)
	return user[0]

def get_instance(Model, look_up_fields):
	try:
		instance = Model.objects.get(**look_up_fields)
		return instance
	except Model.DoesNotExist:
		return None

def get_instances(Model, look_up_fields):
	instances = Model.objects.filter(**look_up_fields)
	if instances.count() > 0:
		return instances
	return None

def get_user_info(user, request=None, check_admin=False):
	try:
		data = {
			"image": get_profile_image(user, request),
			"first_name": user.first_name,
			"last_name": user.last_name,
			"full_name": user.get_full_name(),
			"email": user.email,
			"active": user.is_active,
		}

		try:
			if user.employee:
				data.update({"empId": user.employee.id, 
					"job": user.employee.job_name})

			if check_admin is True:
				employee = user.employee
				if employee is None:
					admin_status = None
				elif employee.is_md is True:
					admin_status = "md"
				elif employee.is_hr is True:
					admin_status = "hr"
				elif employee.is_hod is True:
					admin_status = "hod"
				elif employee.is_supervisor is True:
					admin_status = "supervisor"
				else:
					admin_status = None

				data.update({ 
					"is_admin": user.is_staff,
					"admin_status": admin_status,
					"leaves_taken": employee.leaves_taken,
					"leaves_remaining": employee.leaves_remaining,
				})
		except:
			pass
		return data
	except:
		return None

def validate_field(self, data, field):
		_field = data.get(field)
		if _field is None:
			raise ValidationError(f"{field} is required")
		return _field

def validate_fields(self, data, fields):
	for field in fields:
		validate_field(data, field)
	return True

def get_leave_type(leave_type):
	if leave_type == "A":
		return "Annual"
	elif leave_type == "H":
		return "Hospitalization"
	elif leave_type == "LOP":
		return "Loss Of Pay"
	elif leave_type == "M":
		return "Maternity"
	elif leave_type == "P":
		return "Paternity"
	elif leave_type == "S":
		return "Sick"
	else:
		return "Casual"

def get_overtime_type(overtime_type):
	if overtime_type == "C":
		return "compulsory"
	elif overtime_type == "H":
		return "holiday"
	else:
		return "voluntary"

def get_name_prefix(user):
	if user.profile.gender == "F":
		return "Ms."
	return "Mr."

