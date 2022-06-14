import datetime
from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils.timezone import now

from common.utils import get_overtime_type
from employees.models import Employee
from .managers import (
	LeaveManager, 
	LeaveAdminManager, 
	OvertimeManager, 
	OvertimeAdminManager
)


LEAVE_CHOICES = (
	('A', 'Annual'),
	('C', 'Causal'),
	('H', 'Hospitalization'),
	('LOP', 'Loss Of Pay'),
	('M', 'Maternity'),
	('P', 'Paternity'),
	('S','Sick'),
)

DECISIONS = (
	('A', 'Approved'),
	('D', 'Denied'),
	('N', 'Not Needed'),
	('P', 'Pending'),
)

OVERTIME_CHOICES = (
	('C', 'Compulsory'),
	('H', 'Holiday'),
	('V', 'Voluntary'),
)


ID_LENGTH = settings.LEAVE_ID_MAX_LENGTH


class Leave(models.Model):
	leave_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leaves")
	leave_type = models.CharField(max_length=3, choices=LEAVE_CHOICES, verbose_name="type", default="C")
	start_date = models.DateField()
	end_date = models.DateField()
	reason = models.TextField()
	created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
	a_s = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by Supervisor"
	)
	a_hod = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by HOD"
	)
	a_hr = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by HR"
	)
	a_md = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by MD"
	)
	date_updated = models.DateTimeField(auto_now=True)
	date_requested = models.DateTimeField(auto_now_add=True)

	objects = LeaveManager()
	admin_objects = LeaveAdminManager()

	def __str__(self):
		return f"""{
			self.employee.user.email.capitalize()} type {self.leave_type} from {self.start_date} to {self.end_date
		}"""

	def save(self, *args, **kwargs):
		if self.created_by is None:
			self.created_by = self.employee
		elif self.created_by is not None and (
			self.created_by.user.is_staff is False) and self.created_by != self.employee:
			raise ValueError("Created by must be a staff or the employee himself")
		return super().save(*args,**kwargs)

	def get_absolute_url(self):
		return reverse('leave-detail', kwargs={"id": self.id})

	def get_admin_absolute_url(self):
		return reverse('leave-admin-detail', kwargs={"id": self.id})

	@property
	def status(self):
		if self.a_md == "A":
			return "A"
		elif self.a_s == "D" or self.a_hod == "D" or self.a_hr == "D" or self.a_md == "D":
			return "D"
		elif self.start_date < now().date():
			return "E"
		return "P"

	@property
	def no_of_days(self):
		date = self.end_date - self.start_date
		return date.days

	@property
	def resume_date(self):
		return self.end_date + datetime.timedelta(days=1)

	@property
	def completed(self):
		if self.status == "A":
			current_date = now().date()
			if current_date >= self.end_date:
				return "completed"
			return "ongoing"
		return "not approved"

	@property
	def leave_type_name(self):
		if self.leave_type == "A":
			return "annual"
		elif self.leave_type == "C":
			return "casual"
		elif self.leave_type == "H":
			return "hospitalization"
		elif self.leave_type == "LOP":
			return "loss of pay"
		elif self.leave_type == "M":
			return "maternity"
		elif self.leave_type == "P":
			return "paternity"
		else:
			return "sick"

	def get_status_name(self, status):
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

	def get_admin_status(self, employee, full_name=False):
		if employee.is_md:
			if full_name:
				return self.get_status_name(self.a_md)
			return self.a_md
		elif employee.is_hr:
			if full_name:
				return self.get_status_name(self.a_hr)
			return self.a_hr
		elif employee.is_hod:
			if full_name:
				return self.get_status_name(self.a_hod)
			return self.a_hod
		elif employee.is_supervisor:
			if full_name:
				return self.get_status_name(self.a_s)
			return self.a_s
		if full_name:
			return self.get_status_name("N")
		return "N"

	def check_pending(self):
		if self.a_s == "D" or self.a_hod == "D" or self.a_hr == "D" or self.a_md == "D":
			return False
		elif self.a_md == "P":
			return True
		return False


class Overtime(models.Model):
	overtime_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	employee = models.ForeignKey(Employee, unique_for_date='date', 
		on_delete=models.CASCADE, related_name="overtime")
	overtime_type = models.CharField(max_length=3, choices=OVERTIME_CHOICES, verbose_name="type", default="V")
	date = models.DateField()
	hours = models.IntegerField()
	reason = models.TextField()
	created_by = models.ForeignKey(Employee, related_name="created_overtime", on_delete=models.SET_NULL, null=True)
	a_s = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by Supervisor"
	)
	a_hod = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by HOD"
	)
	a_hr = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by HR"
	)
	a_md = models.CharField(
		max_length=1, choices=DECISIONS, default='P',
		verbose_name="Approved by MD"
	)
	date_updated = models.DateTimeField(auto_now=True)
	date_requested = models.DateTimeField(auto_now_add=True)

	objects = OvertimeManager()
	admin_objects = OvertimeAdminManager()

	def __str__(self):
		return f"{self.employee.user.email.capitalize()} on {self.date}"

	def save(self, *args, **kwargs):
		if self.created_by is None:
			self.created_by = self.employee
		elif self.created_by is not None and (
			self.created_by.user.is_staff is False) and self.created_by != self.employee:
			raise ValueError("Created by must be a staff or the employee himself")
		return super().save(*args,**kwargs)

	def get_absolute_url(self):
		return reverse('overtime-detail', kwargs={"id": self.id})

	def get_admin_absolute_url(self):
		return reverse('overtime-admin-detail', kwargs={"id": self.id})

	@property
	def status(self):
		if self.a_md == "A":
			return "A"
		elif self.a_s == "D" or self.a_hod == "D" or self.a_hr == "D" or self.a_md == "D" or (
			self.date < now().date()):
			return "D"
		return "P"

	def get_status_name(self, status):
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

	@property
	def overtime_type_name(self):
		return get_overtime_type(self.overtime_type)
		
	def get_admin_status(self, employee, full_name=False):
		if employee.is_md:
			if full_name:
				return self.get_status_name(self.a_md)
			return self.a_md
		elif employee.is_hr:
			if full_name:
				return self.get_status_name(self.a_hr)
			return self.a_hr
		elif employee.is_hod:
			if full_name:
				return self.get_status_name(self.a_hod)
			return self.a_hod
		elif employee.is_supervisor:
			if full_name:
				return self.get_status_name(self.a_s)
			return self.a_s
		if full_name:
			return self.get_status_name("N")
		return "N"

	def check_pending(self):
		if self.a_s == "D" or self.a_hod == "D" or self.a_hr == "D" or self.a_md == "D":
			return False
		elif self.a_md == "P":
			return True
		return False

