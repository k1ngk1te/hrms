import datetime
from collections import OrderedDict
from django.db import models
from django.db.models import Q
from django.utils.timezone import now
from rest_framework.exceptions import PermissionDenied, ValidationError

from core.utils import (
	weekdays, 
	get_last_date_of_week, 
	get_last_date_of_month,
	get_default_hours
)

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

		emp_times = emp.get_open_and_close_time()
		open_time = emp_times.get('open')
		close_time = emp_times.get('close')

		if not emp:
			raise ValidationError({"detail": "Employee is required!"})

		current_day_index = weekdays.get(date.strftime('%a').lower()).get("index")

		if current_day_index > 4:
			raise PermissionDenied({"detail": "Unable to complete request. Not a working day!"})

		if current_time < open_time:
			raise PermissionDenied({"detail": "Unable to complete request. It's not opening time!"})

		if current_time > close_time:
			raise PermissionDenied({"detail": "Unable to complete request. It's past closing time!"})			

		punch_in = datetime.time(current_time.hour, current_time.minute, current_time.second)

		instance = self.filter(employee=emp, date=date).first()
		if instance and instance.punch_in:
			raise PermissionDenied({"detail": f"Unable to complete request. You punched in at {instance.punch_in}"})
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

		emp_times = emp.get_open_and_close_time()
		closing_time = emp_times.get('close')

		if closing_time < current_time:
			raise PermissionDenied({"detail": "Unable to complete request. It's past closing time!"})
		instance.punch_out = datetime.time(current_time.hour, current_time.minute, current_time.second)
		instance.save()
		return instance

	def get_diff_hours(self, date, start_time, end_time):
		# Combine the instance date with their respective time
		start = datetime.datetime.combine(date, start_time)
		end = datetime.datetime.combine(date, end_time)

		# Get the difference in timedelta in seconds and convert to hours
		diff_hours = (end - start).total_seconds() / (60 * 60)
		return diff_hours

	def get_instance_info(self, instance=None, hours=0):
		if not instance:
			return None
		return OrderedDict({
			"id": instance.id,
			"date": instance.date,
			"punch_in": instance.punch_in,
			"punch_out": instance.punch_out,
			"hours": hours
		})

	def get_hours(self, instance):
		# instance should be an Attendance model instance
		if not instance:
			return None
		if not instance.punch_in:
			return self.get_instance_info(instance, 0)
		if instance.punch_in and instance.punch_out:
			hours = self.get_diff_hours(instance.date, instance.punch_in, instance.punch_out)
			return self.get_instance_info(instance, hours)

		if instance.punch_in and not instance.punch_out and instance.date == now().date():
			current_time = now().time()

			# Check if the employee is doing overtime and the hours to closing time
			current_time = now().time()

			emp_times = instance.employee.get_open_and_close_time(instance.date)
			closing_time = emp_times.get('close')

			if closing_time < current_time:
				return self.get_instance_info(instance, 0)
			hours = self.get_diff_hours(instance.date, instance.punch_in, current_time)
			return self.get_instance_info(instance, hours)

		# Also wanna check if that day is a working day on the side
		return self.get_instance_info(instance, 0)

	def get_week_hours(self, **kwargs):
		attendance = kwargs.get("attendance", None) # Get an attendance instance else None
		employee = kwargs.get("employee", None) # Get an employee instance else None
		# Get a datetime.date instance else use current date. To be used along side the employee instance
		date = kwargs.get("date", now().date())

		# Make sure an attendance or employee instance is passed
		assert employee is not None or attendance is not None, ( 
            'Provide an instance of the Employee Model Class with a instance of datetime.date or ',
            'Provide an instance of the Attendance Model Class')

		week_hours = get_default_hours() # Get OrderedDict of week hours with values set to 0

		# Get the last date of the week
		if employee: # If an employee instance was passed, use date
			last_date_of_the_week = get_last_date_of_week(date)
		else: # An attendance instance was passed
			employee = attendance.employee # Get the employee on that instance and the date below
			last_date_of_the_week = get_last_date_of_week(attendance.date)

		last_day = weekdays.get(last_date_of_the_week.strftime('%a').lower()) # Should return Sunday

		day_index = last_day.get("index") # Get the week day by the index. Should return 6

		week_hours["mon"] = self.get_hours(self.get_attendance_instance(employee, last_date_of_the_week - datetime.timedelta(days=6)))
		week_hours["tue"] = self.get_hours(self.get_attendance_instance(employee, last_date_of_the_week - datetime.timedelta(days=5)))
		week_hours["wed"] = self.get_hours(self.get_attendance_instance(employee, last_date_of_the_week - datetime.timedelta(days=4)))
		week_hours["thu"] = self.get_hours(self.get_attendance_instance(employee, last_date_of_the_week - datetime.timedelta(days=3)))
		week_hours["fri"] = self.get_hours(self.get_attendance_instance(employee, last_date_of_the_week - datetime.timedelta(days=2)))
		return week_hours

	def get_month_hours(self, emp=None, date=now().date()):
		assert emp is not None, ('Provide an Employee instance')

		start_date = datetime.date(date.year, date.month, 1) # Get Start Date of the month
		end_date = get_last_date_of_month(date) # Get End Date of the month

		atds = self.filter( # Get All Attendance between start and end date inclusive
			Q(employee=emp, date__gte=start_date) & 
			Q(employee=emp, date__lte=end_date))

		hours = [self.get_hours(atd) for atd in atds]
		return hours

	def get_attendance_instance(self, emp, date):
		instance = self.filter(employee=emp, date=date).first()
		return instance if instance else None


class EmployeeManager(models.Manager):

	def get_queryset(self):
		return EmployeeQuerySet(self.model, using=self._db)

	def employees(self, emp):
		return self.get_queryset().get_employees(emp)


"""

# date.strftime('%A')
# Wednesday

# date.strftime('%p')
# AM or PM

# >>> now.strftime("%m-%d-%y. %d %b %Y is a %A on the %d day of %B.")
# '12-02-03. 02 Dec 2003 is a Tuesday on the 02 day of December.'

"""

