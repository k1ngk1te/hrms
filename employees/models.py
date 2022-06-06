from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.urls import reverse
from django.utils.timezone import now

from common.utils import get_instance
from core.utils import get_app_model
from jobs.models import Job
from .managers import AttendanceManager, EmployeeManager

ID_LENGTH = settings.ID_MAX_LENGTH

User = get_user_model()

LEAVE_TOTAL = 12

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

	@staticmethod
	def get_department(name):
		if name is None:
			raise ValueError("department name is required")
		return get_instance(Department, {"name": name})

	def get_absolute_url(self):
		return reverse('department-detail', kwargs={"id": self.id})


class Employee(models.Model):
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

	@staticmethod
	def check_is_supervisor(user):
		try:
			count = Employee.objects.filter(supervisor__user=user).count()
			if count > 0:
				return True
			return False
		except:
			return False

	@staticmethod
	def get_supervised_emps(user):
		if user is None:
			raise ValueError("user is required")
		return Employee.objects.filter(supervisor__user=user)

	@property
	def is_supervisor(self):
		return self.check_is_supervisor(self.user)

	@property
	def is_on_leave(self):
		emp = self.user.employee
		approved_leave = emp.leaves.filter(a_md="A").order_by('date_requested').last()
		if approved_leave:
			current_date = now().date()
			diff = (approved_leave.end_date - current_date).days
			if (diff > 0):
				return True
		return False

	@property
	def status(self):
		if self.user.is_active:
			if self.is_on_leave is False:
				return "Active"
			return "On Leave"
		return "Inactive"

	@property
	def is_hod(self):
		try:
			dep = get_instance(Department, {"hod__user": self.user})
			if dep:
				return True
			return False
		except:
			pass
		return False

	@property
	def leaves_taken(self):
		emp = self.user.employee
		current_year = now().date().year
		leaves = emp.leaves.filter(a_md="A", start_date__year=current_year)
		return leaves.count()

	@property
	def leaves_remaining(self):
		return LEAVE_TOTAL - self.leaves_taken

	@property
	def has_pending_leave(self):
		emp = self.user.employee
		leaves = emp.leaves.exclude(Q(a_md="A") | Q(a_md="D")
			| Q(a_hr="D") | Q(a_hod="D") | Q(a_s="D"))
		for leave in leaves:
			if leave.status == "P":
				return True
		return False

	@property
	def department_name(self):
		if self.department is not None:
			return self.department.name
		return None

	@property
	def job_name(self):
		if self.job is not None:
			return self.job.name
		return None

	@property
	def has_punched_in(self):
		try:
			date = now().date()
			EmployeeModel = get_app_model("employees.Employee")
			emp = EmployeeModel.objects.get(user=self.user)
			attendance = emp.attendance.get(date=date)
			if attendance and attendance.punch_in:
				return attendance.punch_in
			return None
		except:
			pass
		return None

	@property
	def has_punched_out(self):
		try:
			date = now().date()
			EmployeeModel = get_app_model("employees.Employee")
			emp = EmployeeModel.objects.get(user=self.user)
			attendance = emp.attendance.get(date=date)
			if attendance and attendance.punch_out:
				return attendance.punch_out
			return None
		except:
			pass
		return None

	def get_hours_spent(self):
		# date = now()
		pass

	def get_supervisor(self, attr):
		if self.supervisor is not None:
			if attr == "name":
				return self.supervisor.user.get_full_name().capitalize()
			elif attr == "email":
				return self.supervisor.user.email
		return None

	def get_hod(self):
		if self.department is not None and self.department.hod is not None:
			return self.department.hod
		return None

	def relinquish_status(self):
		for dep in Department.objects.filter(hod__user=self.user):
			dep.hod = None
			dep.save()
		for emp in self.get_supervised_emps(self.user):
			emp.supervisor = None
			emp.save()
		self.is_hr = False
		self.is_md = False
		return self.save()


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
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendance")
	date = models.DateField(default=now)
	punch_in = models.TimeField()
	punch_out = models.TimeField(blank=True, null=True)

	objects = AttendanceManager()

	class Meta:
		unique_together = ['employee', 'date']

	def __str__(self):
		return '%s - %s ' % (self.employee, self.date)

	@property
	def hours_spent(self):
		if not self.punch_in:
			return 0
		current_date = now().date()
		if self.date != current_date and not self.punch_out:
			return 0
		current_time = now().time()
		if self.date == current_date and not self.punch_out:
			if current_time.hour > 17 and current_time.minute > 30:
				return 0
			if current_time > 17:
				return 8
			else:
				hour = current_time.hour - self.punch_in.hour
				minute = 59 - self.punch_in.minute
				return float('%s.%s' % (hour, minute))
		if self.punch_in and self.punch_out:
			hour = self.punch_out.hour - self.punch_in.hour
			minute = self.punch_out.minute - self.punch_in.minute
			return float('%s.%s' % (hour, minute))
		return 0


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
	verified = models.BooleanField(default=False)

	def __str__(self):
		return self.name

	@property
	def is_active(self):
		current_date = now().date()
		if current_date <= self.end_date:
			return True
		return False


def file_folder(instance, filename):
    return 'blogs/{}/{}'.format(instance.project.name, filename)

class ProjectFile(models.Model):
	project = models.ForeignKey(Project, on_delete=models.CASCADE)
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
