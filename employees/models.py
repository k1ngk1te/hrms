from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse
from django.utils.timezone import now

from common.utils import get_instance
from jobs.models import Job
from .managers import AttendanceManager, EmployeeManager
from .mixins import EmployeeModelMixin

ATTENDANCE_ID_LENGTH = settings.ATTENDANCE_ID_MAX_LENGTH
ID_LENGTH = settings.ID_MAX_LENGTH

User = get_user_model()

PRIORITY_CHOICES = (
	('H', 'High'),
	('M', 'Medium'),
	('L', 'Low')
)


class Client(models.Model):
	client_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	contact = models.OneToOneField(User, on_delete=models.CASCADE, related_name="client")
	company = models.CharField(max_length=255)
	position = models.CharField(max_length=100)

	def __str__(self):
		return self.company

	@property
	def status(self):
		return self.contact.is_active


class Department(models.Model):
	department_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	name = models.CharField(max_length=50, unique=True)
	hod = models.OneToOneField('Employee', on_delete=models.SET_NULL,
		related_name="head_of_department", blank=True, null=True)

	def __str__(self):
		return self.name

	def get_absolute_url(self):
		return reverse('department-detail', kwargs={"id": self.id})


class Employee(models.Model, EmployeeModelMixin):
	employee_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee")
	job = models.ForeignKey(Job, on_delete=models.SET_NULL, blank=True, null=True)
	supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True)
	department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
	is_hr = models.BooleanField(default=False)
	is_md = models.BooleanField(default=False)
	date_employed = models.DateField(auto_now=True)
	date_updated = models.DateField(auto_now=True)

	objects = EmployeeManager()

	def __str__(self):
		return self.user.email

	def get_absolute_url(self):
		return reverse('employee-detail', kwargs={"id": self.id})


class Holiday(models.Model):
	holiday_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	name = models.CharField(max_length=100)
	date = models.DateField()

	class Meta:
		unique_together = ["name", "date"]

	def __str__(self):
		return self.name


class Attendance(models.Model):
	attendance_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ATTENDANCE_ID_LENGTH, unique=True, editable=False)
	employee = models.ForeignKey(Employee, unique_for_date="date", 
		on_delete=models.CASCADE, related_name="attendance")
	date = models.DateField(default=now)
	punch_in = models.TimeField()
	punch_out = models.TimeField(blank=True, null=True)

	objects = AttendanceManager()

	def __str__(self):
		return '%s - %s ' % (self.employee, self.date)


class Project(models.Model):
	project_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	name = models.CharField(max_length=255, unique=True)
	created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL,
		related_name="created_by", blank=True, null=True)
	client = models.ForeignKey(Client, on_delete=models.SET_NULL, blank=True, null=True)
	start_date = models.DateField()
	end_date = models.DateField()
	initial_cost = models.FloatField(default=0, help_text="Startup/Initial cost to get the app started")
	rate = models.FloatField(default=0, help_text="rate per hour")
	priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default="H")
	leaders = models.ManyToManyField(Employee, related_name="team_leaders", blank=True)
	team = models.ManyToManyField(Employee, related_name="team", blank=True)
	description = models.TextField(blank=True, null=True)
	completed = models.BooleanField(default=False)

	def __str__(self):
		return self.name

	@property
	def is_active(self):
		if self.completed:
			return False
		return True


def file_folder(instance, filename):
    return 'images/projects/{}/{}'.format(instance.project.name, filename)

class ProjectFile(models.Model):
	project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="files")
	name = models.CharField(max_length=255)
	uploaded_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, blank=True, null=True)
	file = models.FileField(upload_to=file_folder)
	file_type = models.CharField(max_length=50, verbose_name='type')
	date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return "%s - %s" % (self.project.name,self.name)


class Task(models.Model):
	task_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL,
		related_name="task_creator", blank=True, null=True)
	project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="task")
	name = models.CharField(max_length=255, unique=True)
	description = models.TextField(blank=True, null=True)
	priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default="H")
	leaders = models.ManyToManyField(Employee, related_name="task_leaders", blank=True)
	followers = models.ManyToManyField(Employee, related_name="followers", blank=True)
	create_date = models.DateField(default=now)
	due_date = models.DateField()
	completed = models.BooleanField(default=False)
	verified = models.BooleanField(default=False)

	def __str__(self):
		return self.name
