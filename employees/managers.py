import datetime
from django.db import models
from django.db.models import Q
from django.utils.timezone import now
from rest_framework.exceptions import PermissionDenied, ValidationError

# date.strftime('%A')
# Wednesday

# date.strftime('%p')
# AM or PM

# >>> now.strftime("%m-%d-%y. %d %b %Y is a %A on the %d day of %B.")
# '12-02-03. 02 Dec 2003 is a Tuesday on the 02 day of December.'

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

		date = data.pop("date", None) # Override this info
		punch_in = data.pop("punch_in", None) # Override this info

		emp = data.get("employee", None)
		punch_out = data.get("punch_out", None)

		date = now().date()
		current_time = now().time()

		open_time = datetime.time(6, 30, 0)
		close_time = datetime.time(6, 30, 0)

		if not emp:
			raise ValidationError({"detail": "Employee is required!"})

		if current_time < open_time:
			raise PermissionDenied({"detail": "Unabled to complete request. It's not opening time!"})

		if current_time > close_time:
			raise PermissionDenied({"detail": "Unabled to complete request. It's past closing time!"})			

		punch_in = datetime.time(current_time.hour, current_time.minute, current_time.second)

		instance = self.filter(employee=emp, date=date).first()
		if instance and instance.punch_in:
			raise PermissionDenied({"detail": f"Unabled to complete request. You punched in at {instance.punch_in}"})
		elif instance and instance.punch_in is None:
			instance.punch_in = punch_in
			instance.save()
			return instance

		if punch_out and punch_in > punch_out:
			raise ValidationError({"punch_out": "Invalid Time. Punch in time is greater than punch out time."})

		return super().create(date=date, punch_in=punch_in, **data)

	def validate_punchout(self, emp):
		date = now().date()
		instance = self.filter(employee=emp, date=date).first()
		if not instance or not instance.punch_in:
			raise PermissionDenied({"detail": "Invalid request! You are yet to punch in for the day."})
		if instance and instance.punch_out:
			raise PermissionDenied({"detail": 
				f"Invalid request! You punched out at {instance.punch_out}"})

		current_time = now().time()
		closing_time = datetime.time(17, 30, 0)

		# Check if the employee is doing overtime and the hours to closing time
		overtime = instance.employee.overtime.filter(date=date, a_md='A')
		final_closing_time = datetime.time(closing_time.hour + overtime.first().hours, 
			closing_time.minute, closing_time.second) if overtime.exists() else closing_time

		if final_closing_time < current_time:
			raise PermissionDenied({"detail": "Unabled to complete request. It's past closing time!"})
		instance.punch_out = datetime.time(current_time.hour, current_time.minute, current_time.second)
		instance.save()
		return instance

	def get_hours(self, instance):
		if not instance.punch_in:
			return 0
		if instance.punch_in and instance.punch_out:
			return self.get_diff_hours(instance.date, instance.punch_in, instance.punch_out)

		current_date = now().date()
		if instance.punch_in and not instance.punch_out and instance.date == current_date:
			current_time = now().time()
			closing_time = datetime.time(17, 30, 0)

			# Check if the employee is doing overtime and the hours to closing time
			overtime = instance.employee.overtime.filter(date=current_date, a_md='A')
			final_closing_time = datetime.time(closing_time.hour + overtime.first().hours, 
				closing_time.minute, closing_time.second) if overtime.exists() else closing_time

			if final_closing_time < current_time:
				return 0
			return self.get_diff_hours(instance.date, instance.punch_in, current_time)

		# Also wanna check if that day is a working day
		return 0

	def get_diff_hours(self, date, start_time, end_time):
		# Combine the instance date with their respective time
		start = datetime.datetime.combine(date, start_time)
		end = datetime.datetime.combine(date, end_time)

		# Get the difference in timedelta in seconds and convert to hours
		diff_hours = (end - start).total_seconds() / (60 * 60)
		return diff_hours


class EmployeeManager(models.Manager):

	def get_queryset(self):
		return EmployeeQuerySet(self.model, using=self._db)

	def employees(self, emp):
		return self.get_queryset().get_employees(emp)