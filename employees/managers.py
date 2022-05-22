from django.db import models
from django.db.models import Q
from django.utils.timezone import now
from rest_framework.exceptions import ValidationError

# Querysets


class EmployeeQuerySet(models.QuerySet):
	def get_employees(self, emp):
		if emp.is_md:
			return self.exclude(is_md=True)
		elif emp.is_hr:
			return self.exclude(Q(is_md=True) | Q(is_hr=True))
		elif emp.is_hod:
			return self.exclude(
				Q(is_md=True) | 
				Q(is_hr=True) |
				Q(id=emp.id)).filter(department__hod=emp)
		elif emp.is_supervisor:
			return self.filter(supervisor=emp)
		else:
			return self.none()


# Managers


class AttendanceManager(models.Manager):
	def create(self, **data):
		date = data.get("date")
		punch_in = data.get("punch_in")
		punch_out = data.get("punch_out")
		current_date = now().date()

		if current_date != date:
			raise ValidationError({"date": "Invalid Date. Attendance must be marked for today's date"})
		if punch_out and punch_in > punch_out:
			raise ValidationError({"punch_out": "Invalid Time. Punch in time is greater than punch out time."})			
		return super().create(**data)


class EmployeeManager(models.Manager):

	def get_queryset(self):
		return EmployeeQuerySet(self.model, using=self._db)

	def employees(self, emp):
		return self.get_queryset().get_employees(emp)