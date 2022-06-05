import datetime
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError

from common.serializer_fields import ClientRelatedField, EmployeeRelatedField
from common.utils import get_request_method, get_instance, get_instances, get_user_info
from core.serializers import PersonSerializer
from jobs.models import Job
from jobs.serializers import JobSerializer
from users.models import Profile
from users.serializers import ProfileSerializer, UserProfileSerializer, UserSerializer, UserDetailsSerializer
from .models import (
	Attendance, 
	Client, 
	Department, 
	Employee, 
	Holiday, 
	Project, 
	ProjectFile,
	Task
)
from .utils import get_employees

User = get_user_model()


class AttendanceSerializer(serializers.ModelSerializer):
	date = serializers.DateField(required=False)
	punch_in = serializers.TimeField(required=False)
	punch_out = serializers.TimeField(required=False)

	class Meta:
		model = Attendance
		exclude = ('employee', )

	def create(self, validated_data):
		action = self.get_action()
		if action == "in":
			attendance = self.validate_punch_in()
		elif action == "out":
			attendance = self.validate_punch_out()
		else:
			raise server_error({"detail": "A server error occurred! Please try again later."})
		return attendance

	def get_action(self):
		action = self.context.get("request").data.get("action", None)
		if action is None:
			raise ValidationError({"detail": "Invalid request. Please provide action value."})
		if action != "in" and action != "out":
			raise ValidationError({"detail": "Invalid action. Either punch in or out."})
		return action

	def get_employee(self):
		user = self.context.get("request").user
		try:
			employee = Employee.objects.get(user=user)
			return employee
		except Employee.DoesNotExist:
			raise ValidationError({"detail": "Employee does not exist!"})
		return None

	def get_instance(self):
		date = now().date()
		return get_instance(Attendance, {"employee": self.get_employee(), "date": date})

	def validate_punch_in(self):
		employee = self.get_employee()
		date = now().date()

		current_time = now().time()

		open_time = datetime.time(6, 30, 0)

		if current_time < open_time:
			raise PermissionDenied({"detail": f"Unabled to complete request. It's not opening time!"})

		punch_in = datetime.time(current_time.hour, current_time.minute, current_time.second)

		instance = get_instance(Attendance, {"employee": employee, "date": date})
		if instance is not None and instance.punch_in:
			raise PermissionDenied({"detail": f"Unabled to complete request. You punched in at {instance.punch_in}"})
		elif instance is not None and instance.punch_in is None:
			instance.punch_in = punch_in
			instance.save()
			return instance
		attendance = Attendance.objects.create(employee=employee, date=date, punch_in=punch_in)
		return attendance

	def validate_punch_out(self):
		current_time = now().time()
		closing_time = datetime.time(17, 30, 0)

		if closing_time < current_time:
			raise PermissionDenied({"detail": f"Unabled to complete request. It's past closing time!"})

		date = now().date()
		instance = self.get_instance()
		if instance is None or instance.punch_in is None:
			raise PermissionDenied({"detail": "Invalid request! You are yet to punch in for the day."})
		if instance and instance.punch_out:
			raise PermissionDenied({"detail": f"Unabled to complete request. You punched out at {instance.punch_out}"})
		instance.punch_out = datetime.time(current_time.hour, current_time.minute, current_time.second)
		instance.save()
		return instance


class ClientSerializer(serializers.ModelSerializer):
	contact = UserProfileSerializer()

	class Meta:
		model = Client
		fields = '__all__'

	def create(self, validated_data):
		contact_data = validated_data.pop("contact")

		email = contact_data.get("email").lower()

		serializer = UserProfileSerializer(data=contact_data, context=self.context)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		user = User.objects.get(email=email)
		client = Client.objects.create(contact=user, **validated_data)
		return client

	def update(self, instance, validated_data):
		contact_data = validated_data.pop("contact")

		serializer = UserProfileSerializer(data=contact_data, instance=instance.contact, context=self.context)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		instance.company = validated_data.get("company", instance.company)
		instance.position = validated_data.get("position", instance.position)
		instance.save()
		return instance


class DepartmentSerializer(serializers.ModelSerializer):
	id = serializers.CharField(required=False)
	name = serializers.CharField(required=False)
	hod = serializers.PrimaryKeyRelatedField(
		queryset=Employee.objects.filter(user__is_active=True),
		required=False, allow_null=True)
	hod_info = serializers.SerializerMethodField('get_hod')
	no_of_employees = serializers.SerializerMethodField('get_no_of_employees')

	class Meta:
		model = Department
		fields = ('name', 'id', 'hod', 'hod_info', 'no_of_employees')

	def create(self, validated_data):
		name = self.validate_name(validated_data.get("name"))
		hod = self.validate_hod(validated_data.get("hod"))

		department = Department.objects.create(name=name, hod=hod)
		return department

	def update(self, instance, validated_data):
		name = self.validate_name(validated_data.get("name"))
		hod = self.validate_hod(validated_data.get("hod"))

		if name is not None and instance.name != name.lower():
			dep = get_instance(Department, {"name": name.lower()})
			if dep is not None:
				raise ValidationError({
					"name": "department with specified name already exists"
				})
			else:
				instance.name = name.lower()
		if hod and hod != instance.hod:
			dep = get_instance(Department, {"hod": hod})
			if dep:
				raise ValidationError(
					f"This employee is already the Head of Department for {dep.name}")
			instance.hod = hod
		instance.save()
		return instance

	def validate_name(self, value):
		if value is None:
			raise ValidationError("name is required")

		name = value.lower().strip()
		method = get_request_method(self.context)
		if method != 'PUT' and method != 'PATCH':
			dep = get_instance(Department, {"name": name})
			if dep:
				raise ValidationError("department with this name already exists!")
		return name

	def validate_hod(self, hod):
		if hod:
			if hod.user.is_active is False:
				raise ValidationError("employee is inactive or deactivated")
			method = get_request_method(self.context)
			if method != 'PUT' and method != 'PATCH':
				dep = get_instance(Department, {"hod": hod})
				if dep:
					raise ValidationError(
						f"This employee is already the Head of Department for {dep.name}")
		return hod

	def get_hod(self, obj):
		if obj.hod:
			request = self.context.get("request")
			data = get_user_info(obj.hod.user, request)
			return data
		return None

	def get_no_of_employees(self, obj):
		count = Employee.objects.filter(
			user__is_active=True, department__name=obj.name).count()
		return count


class EmployeeSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	profile = ProfileSerializer(source='user.profile')
	job = JobSerializer()
	department = DepartmentSerializer()
	supervisor = serializers.PrimaryKeyRelatedField(
		queryset=Employee.objects.filter(user__is_active=True),
		required=False, allow_null=True)
	supervisor_info = serializers.SerializerMethodField('get_supervisor_info')
	status = serializers.SerializerMethodField('get_status')
	active = serializers.SerializerMethodField('get_active')

	class Meta:
		model = Employee
		fields = ('id', 'user', 'job', 'profile', 'department',
		'supervisor', 'supervisor_info', 'status', 'date_employed', 'active')

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		user = user_data.pop("user")
		p_data = user_data.pop('profile')

		self._validate_profile(user, p_data)

		employee = Employee.objects.create(user=user, **validated_data)
		return employee

	def update(self, instance, validated_data):
		user_data = self._validate_user(validated_data.pop('user'), instance)
		user = user_data.pop('user')
		p_data = user_data.pop('profile')

		self._validate_profile(user, p_data)

		instance.job = validated_data.get("job", instance.job)
		instance.department = validated_data.get("department", instance.department)
		instance.supervisor = validated_data.get("supervisor", instance.supervisor)
		instance.save()
		return instance

	def get_supervisor_info(self, obj):
		if obj.supervisor:
			return get_user_info(obj.supervisor.user)
		return None

	def get_active(self, obj):
		return obj.user.is_active

	def get_status(self, obj):
		return obj.status.lower()

	def validate_user(self, value):
		if value.get('email') is None:
			raise ValidationError({"email": "email is required"})
		if value.get('first_name') is None:
			raise ValidationError({"first_name": "first name is required"})
		if value.get('last_name') is None:
			raise ValidationError({"last_name": "last_name is required"})
		request = self.context.get("request")
		if request.method == "POST":
			user = get_instance(User, {"email": value.get('email').strip().lower()})
			if user is not None:
				raise ValidationError({"email": "user with specified email already exists"})
			serializer = UserSerializer(data=value)
			if serializer.is_valid():
				serializer.save()
				return {
					"user": get_instance(User, {"email": value.get('email').strip().lower()})
				}
			raise ValidationError(serializer.errors)
		return value

	def _validate_user(self, value, instance):
		if instance.user.email != value.get('email').strip().lower():
			check_user = get_instance(User, {"email":value.get('email').strip().lower()})
			if check_user is None:
				instance.user.email = value.get('email').strip().lower()
			else:
				raise ValidationError({"email": "user with specified email already exists"})
		instance.user.first_name = value.get('first_name', instance.user.first_name)
		instance.user.last_name = value.get('last_name', instance.user.last_name)
		instance.user.save()

		return {
			"user": instance.user,
			"profile": value.pop("profile")
		}

	def _validate_profile(self, user, data):
		profile_data = {};
		for key, value in data.items():
			profile_data.update({ key: value })

		profile = Profile.objects.get_or_create(user=user)[0]
		profile.image = profile_data.get('image', profile.image)
		_gender = profile_data.get("gender", profile.gender)
		if _gender and _gender != "M" and _gender != "F":
			raise ValidationError({"gender": "Gender is invalid"})
		profile.gender = _gender
		profile.date_of_birth = profile_data.get("date_of_birth", profile.date_of_birth)
		profile.phone = profile_data.get("phone", profile.phone)
		profile.address = profile_data.get("address", profile.address)
		profile.state = profile_data.get("state", profile.state)
		profile.city = profile_data.get("city", profile.city)
		profile.save()
		return profile

	def validate_department(self, value):
		department = get_instance(Department, {"id": value.get("id")})
		if department is None:
			raise ValidationError("department does not exist")
		return department

	def validate_job(self, value):
		job = get_instance(Job, {"id": value.get("id")})
		if job is None:
			raise ValidationError("job does not exist")
		return job


class HolidaySerializer(serializers.ModelSerializer):
	class Meta:
		model = Holiday
		fields = '__all__'


class ProjectEmployeeSerializer(PersonSerializer):
	id = serializers.CharField()
	job = serializers.SerializerMethodField('get_job')

	class Meta:
		model = Employee
		relation_key = 'user'
		fields = ('id', 'job',) + PersonSerializer.Meta.fields

	def get_job(self, obj):
		try:
			return obj.job.name
		except:
			pass
		return ""


class TaskSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	project = serializers.SerializerMethodField('get_project_info')
	leaders = ProjectEmployeeSerializer(many=True, required=False)
	followers = ProjectEmployeeSerializer(many=True, required=False)
	created_by = ProjectEmployeeSerializer(read_only=True)
	create_date = serializers.DateField(read_only=True)
	completed = serializers.BooleanField(read_only=True)
	verified = serializers.BooleanField(read_only=True)

	class Meta:
		model = Task
		exclude = ('task_id',)

	def create(self, validated_data):
		created_by = self.context.get("request").user.employee
		create_date = now().date()
		project = self.get_project()

		followers = validated_data.pop("followers", None)
		leaders = validated_data.pop("leaders", None)

		task_leaders = get_employees("leaders", leaders) if leaders is not None else []
		task_members = get_employees("followers", followers) if followers is not None else []

		task = Task.objects.create(create_date=create_date, created_by=created_by,
			project=project, **validated_data)
		self.set_team(task, task_leaders, task_members)

		return task

	def update(self, instance, validated_data):
		created_by = self.context.get("request").user.employee

		if created_by != instance.created_by:
			raise PermissionDenied({"detail":
				"You do not have permission to perform this request!"})

		followers = validated_data.pop("followers", None)
		leaders = validated_data.pop("leaders", None)

		task_leaders = get_employees("leaders", leaders) if leaders is not None else []
		task_members = get_employees("followers", followers) if followers is not None else []

		self.set_team(instance, task_leaders, task_members)

		instance.name = validated_data.get("name", instance.name)
		instance.description = validated_data.get("description", instance.description)
		instance.due_date = validated_data.get("due_date", instance.due_date)
		instance.priority = validated_data.get("priority", instance.priority)
		instance.save()

		return instance

	def get_project_info(self, obj):
		return {
			"id": obj.project.id,
			"name": obj.project.name
		}

	def get_project(self):
		kwargs = self.context.get("view").kwargs
		project_id = kwargs.get("project_id", None)
		if project_id is None:
			raise ValidationError({"detail": "Project ID is required!"})
		project = get_instance(Project, {"id": project_id})
		if not project:
			raise NotFound({"detail": f"Project with ID {project_id} was not found!"})
		return project

	def set_team(self, task, leaders=[], followers=[]):
		task.leaders.set(leaders)
		total_team_members = followers + leaders
		task.followers.set(total_team_members)
		return task


class ProjectSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	client = ClientRelatedField(queryset=Client.objects.filter(
		contact__is_active=True), required=False)
	leaders = ProjectEmployeeSerializer(many=True, required=False)
	team = ProjectEmployeeSerializer(many=True, required=False)
	created_by = ProjectEmployeeSerializer(read_only=True)
	completed = serializers.BooleanField(read_only=True)
	verified = serializers.BooleanField(read_only=True)
	is_active = serializers.SerializerMethodField('get_is_active')

	class Meta:
		model = Project
		exclude = ('project_id',)

	def create(self, validated_data):
		created_by = self.context.get("request").user.employee
		team = validated_data.pop("team", None)
		leaders = validated_data.pop("leaders", None)

		team_leaders = get_employees("leaders", leaders) if leaders is not None else []
		team_members = get_employees("team", team) if team is not None else []

		project = Project.objects.create(created_by=created_by, **validated_data)

		self.set_team(project, team_leaders, team_members)
		return project

	def update(self, instance, validated_data):
		created_by = self.context.get("request").user.employee

		if created_by != instance.created_by:
			raise PermissionDenied({"detail":
				"You do not have permission to perform this request!"})

		team = validated_data.pop("team", None)
		leaders = validated_data.pop("leaders", None)

		team_leaders = get_employees("leaders", leaders) if leaders is not None else []
		team_members = get_employees("team", team) if team is not None else []

		self.set_team(instance, team_leaders, team_members)

		instance.name = validated_data.get("name", instance.name)
		instance.description = validated_data.get("description", instance.description)
		instance.initial_cost = validated_data.get("initial_cost", instance.initial_cost)
		instance.rate = validated_data.get("rate", instance.rate)
		instance.client = validated_data.get("client", instance.client)
		instance.start_date = validated_data.get("start_date", instance.start_date)
		instance.end_date = validated_data.get("end_date", instance.end_date)
		instance.priority = validated_data.get("priority", instance.priority)
		instance.save()

		return instance

	def set_team(self, project, leaders=[], team=[]):
		project.leaders.set(leaders)
		total_team_members = team + leaders
		project.team.set(total_team_members)
		return project

	def get_is_active(self, obj):
		return obj.is_active


class ProjectFileSerializer(serializers.ModelSerializer):
	project = serializers.SerializerMethodField('get_project_info')
	file_type = serializers.CharField(read_only=True)

	class Meta:
		model = ProjectFile
		fields = '__all__'

	def get_project_info(self, obj):
		return {
			"id": obj.project.id,
			"name": obj.project.name
		}

	def get_project(self, project_id):
		project = get_instance(Project, {"id": project_id})
		if not project:
			raise ValidationError({"detail": f"Project with ID {project_id} was not found"})
		return project

	def create(self, validated_data):
		file = validated_data.get("file", None)
		content_type = file.content_type.split("/")[0]
		allowed_content_types = ["application", "image"]
		employee = self.context.get("request").user.employee

		if content_type not in allowed_content_types:
			raise ValidationError({"file": "Invalid file. Send in an image, pdf or microsoft word file"})

		project = self.get_project(self.context.get("view").kwargs.get("project_id"))

		if not file:
			raise ValidationError({"file": "File is required!"})

		return ProjectFile.objects.create(
			project=project, 
			file_type=file.content_type,
			uploaded_by=employee,
			**validated_data
		)

	def update(self, instance, validated_data):
		# Prevent the file from being updated
		return instance
		# instance.file = validated_data.get("file", instance.file)
		# instance.image = validated_data.get("image", instance.image)
		# instance.save()
		# return instance


