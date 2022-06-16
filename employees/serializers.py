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


class UserEmployeeSerializer(PersonSerializer):
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


class AttendanceSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	date = serializers.DateField(required=False)
	punch_in = serializers.TimeField(required=False)
	punch_out = serializers.TimeField(required=False)
	overtime = serializers.SerializerMethodField('get_overtime_hours')

	class Meta:
		model = Attendance
		exclude = ('employee', 'attendance_id')

	def create(self, validated_data):
		action = self.context.get("action", None)
		if not action:
			raise ValidationError({"detail": "action is required! Input 'in' or 'out'"})
		if action != "in" and action != "out":
			raise ValidationError({"detail": "Invalid action! Input 'in' or 'out'"})

		employee = self.context.get("request").user.employee
		if action == "in":
			attendance = Attendance.objects.create(employee=employee, **validated_data)
		elif action == "out":
			attendance = Attendance.objects.validate_punchout(employee)
		return attendance

	def get_overtime_hours(self, obj):
		overtime = obj.employee.has_overtime(obj.date)
		return overtime.hours if overtime else None


class ClientSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	contact = UserProfileSerializer()

	class Meta:
		model = Client
		exclude = ('client_id', )

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
	hod = UserEmployeeSerializer(required=False)
	no_of_employees = serializers.SerializerMethodField('get_no_of_employees')

	class Meta:
		model = Department
		fields = ('name', 'id', 'hod', 'no_of_employees')

	def create(self, validated_data):
		name = validated_data.get("name")
		hod = validated_data.get("hod")

		department = Department.objects.create(name=name, hod=hod)
		return department

	def update(self, instance, validated_data):
		name = validated_data.get("name")
		hod = validated_data.get("hod")

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
				raise ValidationError({ "hod": {
					"id": f"This employee is already the Head of Department for {dep.name}"}})
			instance.hod = hod
		instance.save()
		return instance

	def validate_name(self, value):
		name = value.lower().strip() if value else value
		method = get_request_method(self.context)
		if method != 'PUT' and method != 'PATCH':
			if not name:
				raise ValidationError("Departmen name is required!")
			dep = get_instance(Department, {"name": name})
			if dep:
				raise ValidationError("Department with this name already exists!")
		return name

	def validate_hod(self, value):
		if not value:
			return None
		id = value.get("id")
		hod = get_instance(Employee, {"id": id})
		if hod is None:
			raise ValidationError({"id": f"Employee with ID {id} does not exist!"})	
		if hod.user.is_active is False:
			raise ValidationError({"id": "employee is inactive or deactivated"})
		method = get_request_method(self.context)
		if method != 'PUT' and method != 'PATCH':
			dep = get_instance(Department, {"hod": hod})
			if dep:
				raise ValidationError({"id":
					f"This employee is already the Head of Department for {dep.name}"})
		return hod

	def get_no_of_employees(self, obj):
		count = Employee.objects.filter(
			user__is_active=True, department__name=obj.name).count()
		return count


class EmployeeSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	user = UserSerializer()
	profile = ProfileSerializer(source='user.profile')
	job = JobSerializer()
	department = DepartmentSerializer()
	supervisor = UserEmployeeSerializer(required=False)
	status = serializers.SerializerMethodField('get_status')
	active = serializers.SerializerMethodField('get_active')

	class Meta:
		model = Employee
		fields = ('id', 'user', 'job', 'profile', 'department',
		'supervisor', 'status', 'date_employed', 'active')

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
		id = value.get("id")
		job = get_instance(Job, {"id": id})
		if job is None:
			raise ValidationError(f"Job with ID {id} does not exist!")
		return job

	def validate_supervisor(self, value):
		if not value:
			return None
		id = value.get("id")
		supervisor = get_instance(Employee, {"id": id})
		if supervisor is None:
			raise ValidationError({"id": f"Employee with ID {id} does not exist!"})
		if not supervisor.user.is_active:
			raise ValidationError({"id": f"Employee with ID {id} is not active!"})
		return supervisor


class HolidaySerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)

	class Meta:
		model = Holiday
		exclude = ('holiday_id',)


class ProjectSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	client = ClientRelatedField(queryset=Client.objects.filter(
		contact__is_active=True), required=False)
	leaders = UserEmployeeSerializer(many=True, required=False)
	team = UserEmployeeSerializer(many=True, required=False)
	created_by = UserEmployeeSerializer(read_only=True)
	tasks = serializers.SerializerMethodField('get_tasks')
	files = serializers.SerializerMethodField('get_files')
	completed = serializers.BooleanField(read_only=True)
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

	def get_files(self, obj):
		# Check if the request is in detail view to avoid loading tasks on list view
		try:
			project_id = self.context.get("view").kwargs.get("id", None)
			if not project_id:
				return []
			serializer = ProjectFileSerializer(obj.files.all(), many=True, context=self.context)
			return serializer.data
		except:
			pass
		return []

	def get_tasks(self, obj):
		# Check if the request is in detail view to avoid loading tasks on list view
		try:
			project_id = self.context.get("view").kwargs.get("id", None)
			if not project_id:
				return []
			tasks = []
			for task in obj.task.all()[:15]:
				tasks.append({
					"id": task.id,
					"name": task.name,
					"completed": task.completed
				})
			return tasks
		except:
			pass
		return []

	def get_is_active(self, obj):
		return obj.is_active


class ProjectFileSerializer(serializers.ModelSerializer):
	project = serializers.SerializerMethodField('get_project_info')
	name = serializers.CharField(required=False)
	file_type = serializers.CharField(read_only=True)
	uploaded_by = serializers.SerializerMethodField('get_uploaded_by')
	size = serializers.SerializerMethodField('get_size')
	date = serializers.DateTimeField(read_only=True)

	class Meta:
		model = ProjectFile
		fields = '__all__'

	def get_uploaded_by(self, obj):
		return {
			"id": obj.uploaded_by.id,
			"name": obj.uploaded_by.user.get_full_name()
		}

	def get_size(self, obj):
		return obj.file.size

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

		name = validated_data.pop("name", None)
		if not name:
			name = file.name[:245] + file.name.split(".")[-1] if len(file.name) > 250 else file.name

		return ProjectFile.objects.create(
			project=project, 
			file_type=file.content_type,
			uploaded_by=employee,
			name=name,
			**validated_data
		)

	def update(self, instance, validated_data):
		# Prevent the file from being updated
		return instance


class TaskSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	project = serializers.SerializerMethodField('get_project_info')
	leaders = UserEmployeeSerializer(many=True, required=False)
	followers = UserEmployeeSerializer(many=True, required=False)
	created_by = UserEmployeeSerializer(read_only=True)
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


