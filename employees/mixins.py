import datetime
from collections import OrderedDict
from django.conf import settings
from django.db.models import Q
from django.utils.timezone import now

from common.utils import get_instance
from core.utils import weekdays, get_app_model, get_last_date_of_week, get_last_date_of_month

LEAVE_TOTAL = settings.LEAVE_TOTAL


class EmployeeModelMixin:
	@property
	def employee_model(self):
		return get_app_model("employees.Employee")

	@property
	def attendance_model(self):
		return get_app_model("employees.Attendance")

	@property
	def is_supervisor(self):
		if self.supervised_emps.count() > 0:
			return True
		return False

	@property
	def is_on_leave(self):
		# Get all approved leaves with start date less than or equal to today
		# And end_dates greater than today
		active_leaves_count = self.user.employee.leaves.filter(a_md="A",
			start_date__lte=now().date(), end_date__gt=now().date()).order_by(
			'-date_requested', '-start_date').count()
		if active_leaves_count > 0:
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
		Department = get_app_model("employees.Department")
		dep = get_instance(Department, {"hod__user": self.user})
		if dep:
			return True
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
	def supervised_emps(self):
		EmployeeModel = self.employee_model
		return EmployeeModel.objects.filter(supervisor__user=self.user)

	def has_active_leave(self, start_date, end_date=None):
		assert end_date is not None, ('Provide End Date')
		# A method to check if the employee has an active leave in the range of dates
		leaves = self.user.employee.leaves.filter(a_md="A") # Get active leaves
		for leave in leaves:
			if (leave.start_date <= start_date <= leave.end_date) or (
				leave.start_date <= end_date <= leave.end_date):
				return True
		return False

	def has_pending_leave(self, start_date, end_date=None):
		assert end_date is not None, ('Provide End Date')
		# A method to check if the employee has a pending leave in the range of dates
		leaves = self.user.employee.leaves.exclude(Q(a_md="A") | Q(a_md="D") # Remove all active and denied leaves
			| Q(a_hr="D") | Q(a_hod="D") | Q(a_s="D"))
		for leave in leaves:
			if (leave.start_date <= start_date <= leave.end_date) or (
				leave.start_date <= end_date <= leave.end_date):
				return True
		return False

	def has_pending_or_active_leave(self, start_date, end_date=None):
		assert end_date is not None, ('Provide End Date')
		# A method to check if the employee has a pending or active leave in the range of dates
		leaves = self.user.employee.leaves.exclude(Q(a_md="D") # Remove all denied leaves
			| Q(a_hr="D") | Q(a_hod="D") | Q(a_s="D"))
		for leave in leaves:
			if (leave.start_date <= start_date <= leave.end_date) or (
				leave.start_date <= end_date <= leave.end_date):
				if leave.a_md == "A":
					return [True, f"You are on leave from {leave.start_date} to {leave.end_date}"]
				return [True, f"You have pending leave request from {leave.start_date} to {leave.end_date}"]
		return [False, "You do not have pending nor active leave."]

	def total_hours_for_the_day(self, date=now().date(), **kwargs):
		# A method that returns the total hours an employee should or
		# is expected to spend for the day
		wo = kwargs.get('wo', False) # wo stands for 'without overtime'
		times = self.get_open_and_close_time(date, wo=wo)
		open_time = times.get('open')
		close_time = times.get('close')
		opening_time = datetime.timedelta(
			hours=open_time.hour,minutes=open_time.minute,seconds=open_time.second)
		closing_time = datetime.timedelta(
			hours=close_time.hour,minutes=close_time.minute,seconds=close_time.second)
		diff_time = closing_time - opening_time
		return diff_time.total_seconds() / (60 * 60)

	def total_hours_spent_for_the_day(self, date=now().date()):
		# A method that returns the total hours an employee
		# spent for the day
		attendance = self.has_attendance(date)
		if not attendance:
			return 0
		AttendanceModel = self.attendance_model
		return AttendanceModel.objects.get_hours(attendance).get('hours')

	def total_hours_for_the_week(self, date=now().date()):
		# A method that returns the total hours an employee should or
		# is expected to spend for the week

		AttendanceModel = self.attendance_model
		last_date_of_the_week = get_last_date_of_week(date)
		mon = self.total_hours_for_the_day(last_date_of_the_week - datetime.timedelta(days=6))
		tue = self.total_hours_for_the_day(last_date_of_the_week - datetime.timedelta(days=5))
		wed = self.total_hours_for_the_day(last_date_of_the_week - datetime.timedelta(days=4))
		thu = self.total_hours_for_the_day(last_date_of_the_week - datetime.timedelta(days=3))
		fri = self.total_hours_for_the_day(last_date_of_the_week - datetime.timedelta(days=2))

		return mon + tue + wed + thu + fri

	def total_hours_spent_for_the_week(self, date=now().date()):
		# A method that returns the total hours an employee
		# spent for the week
		AttendanceModel = self.attendance_model
		hours_spent = AttendanceModel.objects.get_week_hours(
			employee=self.user.employee, date=date)

		mon = hours_spent.get('mon'); tue = hours_spent.get('tue'); wed = hours_spent.get('wed');
		thu = hours_spent.get('thu'); fri = hours_spent.get('fri')

		mon_hours = mon.get('hours') if mon else 0
		tue_hours = tue.get('hours') if tue else 0
		wed_hours = wed.get('hours') if wed else 0
		thu_hours = thu.get('hours') if thu else 0
		fri_hours = fri.get('hours') if fri else 0

		return mon_hours + tue_hours + wed_hours + thu_hours + fri_hours		

	def total_hours_for_the_month(self, date=now().date()):
		# A method that returns the total hours an employee should or
		# is expected to spend for the month
		assert isinstance(date, datetime.date), ('Date should be an instance of datetime.date')

		start_date = datetime.date(date.year, date.month, 1)
		end_date = get_last_date_of_month(date)
		hours = 0
		while start_date <= end_date:
			day_index = weekdays.get(start_date.strftime('%a').lower()).get("index")
			if day_index > 4:
				hours += 0
			else:
				hours += self.total_hours_for_the_day(start_date)
			start_date += datetime.timedelta(days=1)
		return hours

	def total_hours_spent_for_the_month(self, date=now().date()):
		# A method that returns the total hours an employee
		# spent for the month
		AttendanceModel = self.attendance_model
		atds = AttendanceModel.objects.get_month_hours(self.user.employee) # Get hours for each valid attendance in the month
		hours = 0
		for atd in atds:
			hours += atd.get('hours', 0)
		return hours

	def has_attendance(self, date=now().date()):
		try:
			attendance = self.user.employee.attendance.get(date=date)
			return attendance
		except:
			pass
		return None

	def get_open_and_close_time(self, date=now().date(), **kwargs):
		wo = kwargs.get('wo', False) # wo stands for 'without overtime'

		open_time = datetime.time(7, 0, 0)
		closing_time = datetime.time(20, 30, 0)

		if wo:
			return OrderedDict({"open": open_time, "close": closing_time})	
		overtime = self.has_overtime(date)
		close_time = datetime.time(closing_time.hour + overtime.hours, 
			closing_time.minute, closing_time.second) if overtime else closing_time
		return OrderedDict({"open": open_time, "close": close_time})

	def get_supervisor(self, attr="name"):
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
		Department = get_app_model("employees.Department")
		for dep in Department.objects.filter(hod__user=self.user):
			dep.hod = None
			dep.save()
		for emp in self.supervised_emps:
			emp.supervisor = None
			emp.save()
		self.is_hr = False
		self.is_md = False
		return self.save()

	def has_overtime(self, date=now().date()):
		overtime = self.user.employee.overtime.filter(date=date, a_md='A')
		return overtime.first() if overtime.exists() is True else None

	def has_pending_overtime(self, date=now().date()):
		# A method to check if the employee has a pending overtime for this date
		overtime = self.user.employee.overtime.filter(date=date)
		for ov in overtime:
			# Check if any admin denied it and if the md approved it them return False
			if ov.a_s == "D" or ov.a_hod == "D" or ov.a_hr == "D" or ov.a_md == "D" or ov.a_md == "A":
				pass
			else:
				return True
		return False

