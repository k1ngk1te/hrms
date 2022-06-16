import datetime
from django.db import models
from django.db.models import Q
from django.utils.timezone import now
from rest_framework.exceptions import ValidationError

from employees.models import Employee


# Querysets

class LeaveQuerySet(models.QuerySet):
	def get_leaves_by_date(self, emp, _from, _to):
		try:
			if _from is None:
				raise ValidationError({"from": "From date is required"})
			if _to is None:
				raise ValidationError({"to": "To date is required"})
			from_date = _from
			to_date = _to
			if isinstance(emp, Employee) is False:
				raise ValidationError({"emp": "Employee must be an employee instance."})
			if isinstance(_from, str):
				from_date = datetime.datetime.strptime(_from, "%Y-%m-%d").date()
			if isinstance(_to, str):
				to_date = datetime.datetime.strptime(_to, "%Y-%m-%d").date()
			if isinstance(_from, datetime.date) is False and isinstance(_from, str) is False:
				raise ValidationError({"from": "From date must either be a string or a date object"})
			if isinstance(_to, datetime.date) is False and isinstance(_to, str) is False:
				raise ValidationError({"to": "To date must either be a string or a date object"})
			return self.filter(Q(employee=emp) & Q(start_date__gte=from_date) & Q(
				start_date__lte=to_date))
		except ValueError:
			raise ValidationError({
				"from": "From date must match format \'%Y-%m-%d\' ",
				"to": "To date must match format \'%Y-%m-%d\' "
			})
		return self.none()


class LeaveAdminQuerySet(models.QuerySet):
	def get_leaves(self, emp):
		if emp.is_md:
			return self.filter(Q(a_hr="A") | Q(a_hr="N"))
		elif emp.is_hr:
			return self.exclude(Q(employee__is_md=True) | Q(employee__is_hr=True) | Q(a_hr="N")
				).filter(Q(a_hod="A") | Q(a_hod="N"))
		elif emp.is_hod:
			return self.exclude(
				Q(employee__is_md=True) | 
				Q(employee__is_hr=True) |
				Q(a_hod="N")
				).filter(Q(employee__department__hod=emp) & (Q(a_s="A") | Q(a_s="N")))
		elif emp.is_supervisor:
			return self.exclude(a_s="N").filter(employee__supervisor=emp)
		else:
			return self.none()

	def get_leaves_by_date(self, emp, _from, _to):
		try:
			if _from is None:
				raise ValidationError({"from": "From date is required"})
			if _to is None:
				raise ValidationError({"to": "To date is required"})
			from_date = _from
			to_date = _to
			if isinstance(emp, Employee) is False:
				raise ValidationError({"emp": "Employee must be an employee instance."})
			if isinstance(_from, str):
				from_date = datetime.datetime.strptime(_from, "%Y-%m-%d").date()
			if isinstance(_to, str):
				to_date = datetime.datetime.strptime(_to, "%Y-%m-%d").date()
			if isinstance(_from, datetime.date) is False and isinstance(_from, str) is False:
				raise ValidationError({"from": "From date must either be a string or a date object"})
			if isinstance(_to, datetime.date) is False and isinstance(_to, str) is False:
				raise ValidationError({"to": "To date must either be a string or a date object"})
			leaves = self.get_leaves(emp)
			return leaves.filter(Q(start_date__gte=from_date) & Q(start_date__lte=to_date))
		except ValueError:
			raise ValidationError({
				"from": "From date must match format \'%Y-%m-%d\' ",
				"to": "To date must match format \'%Y-%m-%d\' "
			})
		return self.none()


class OvertimeQuerySet(models.QuerySet):
	# Get all overtime from specified date to current date or specified_date
	def get_overtime_by_date(self, emp, _from, _to=None):
		try:
			if _from is None:
				raise ValidationError({"from": "From date is required"})
			from_date = _from
			to_date = now().date() if _to is None else _to
			if isinstance(emp, Employee) is False:
				raise ValidationError({"emp": "Employee must be an employee instance."})
			if isinstance(_from, str):
				from_date = datetime.datetime.strptime(_from, "%Y-%m-%d").date()
			if _to and isinstance(_to, str):
				to_date = datetime.datetime.strptime(_to, "%Y-%m-%d").date()
			if isinstance(_from, datetime.date) is False and isinstance(_from, str) is False:
				raise ValidationError({"from": "From date must either be a string or a date object"})
			if isinstance(_to, datetime.date) is False and isinstance(_to, str) is False:
				raise ValidationError({"to": "To date must either be a string or a date object"})
			return self.filter(Q(employee=emp) & Q(date__gte=from_date) & Q(date__lte=to_date))
		except ValueError:
			raise ValidationError({
				"from": "From date must match format \'%Y-%m-%d\' ",
				"to": "To date must match format \'%Y-%m-%d\' "
			})
		return self.none()


class OvertimeAdminQuerySet(models.QuerySet):
	def get_overtimes(self, emp):
		if emp.is_md:
			return self.filter(Q(a_hr="A") | Q(a_hr="N"))
		elif emp.is_hr:
			return self.exclude(Q(employee__is_md=True) | Q(employee__is_hr=True) | Q(a_hr="N")
				).filter(Q(a_hod="A") | Q(a_hod="N"))
		elif emp.is_hod:
			return self.exclude(
				Q(employee__is_md=True) | 
				Q(employee__is_hr=True) |
				Q(a_hod="N")
				).filter(Q(employee__department__hod=emp) & (Q(a_s="A") | Q(a_s="N")))
		elif emp.is_supervisor:
			return self.exclude(a_s="N").filter(employee__supervisor=emp)
		else:
			return self.none()

	def get_overtime_by_date(self, emp, _from, _to=None):
		try:
			if _from is None:
				raise ValidationError({"from": "From date is required"})
			
			from_date = _from
			to_date = now().date() if _to is None else _to
			if isinstance(emp, Employee) is False:
				raise ValidationError({"emp": "Employee must be an employee instance."})
			if isinstance(_from, str):
				from_date = datetime.datetime.strptime(_from, "%Y-%m-%d").date()
			if _to and isinstance(_to, str):
				to_date = datetime.datetime.strptime(_to, "%Y-%m-%d").date()
			if isinstance(_from, datetime.date) is False and isinstance(_from, str) is False:
				raise ValidationError({"from": "From date must either be a string or a date object"})
			if isinstance(_to, datetime.date) is False and isinstance(_to, str) is False:
				raise ValidationError({"to": "To date must either be a string or a date object"})
			overtimes = self.get_overtimes(emp)
			return overtimes.filter(Q(date__gte=from_date) & Q(date__lte=to_date))
		except ValueError:
			raise ValidationError({
				"from": "From date must match format \'%Y-%m-%d\' ",
				"to": "To date must match format \'%Y-%m-%d\' "
			})
		return self.none()


# Managers


class LeaveManager(models.Manager):
	def create(self, do_check=True, **leave_data):
		emp = leave_data.get('employee')
		start_date = leave_data.get('start_date')
		end_date = leave_data.get('end_date')

		if not start_date:
			raise ValidationError({ "start_date": "The start date must be set" })
		if not end_date:
			raise ValidationError({ "end_date": "The end date must be set" })
		if (end_date - start_date).days <= 0:
			raise ValidationError({ "end_date": "The number of days must be at least 1" })

		current_date = now().date()
		if (start_date - current_date).days < 0:
			raise ValidationError({ "start_date": "Start date must be a present or future date" })

		[valid, reason] = self.can_request_leave(emp, start_date, end_date)
		if valid is False:
			raise ValidationError({"detail": reason})

		if do_check:
			if emp.supervisor is None:
				leave_data.update({ "a_s": "N", "a_hod": "P", "a_hr": "P", "a_md": "P" })
			if emp.get_hod() is None:
				leave_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "P", "a_md": "P" })
			if emp.get_hod() == emp:
				leave_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "P", "a_md": "P" })
			if emp.is_hr is True:
				leave_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "N", "a_md": "P" })
			if emp.is_md is True:
				leave_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "N", "a_md": "A" })
		return super().create(**leave_data)

	def get_queryset(self):
		return LeaveQuerySet(self.model, using=self._db)

	def filter_by_date(self, emp, _from, _to):
		return self.get_queryset().get_leaves_by_date(emp, _from, _to)

	def can_request_leave(self, emp, start_date, end_date):
		if emp.user.is_active is False:
			return [False, "Employee is Inactive!"]
		if emp.is_on_leave is True:
			return [False, "Currently on leave!"]
		if emp.leaves_remaining <= 0:
			return [False, "You have run out of leaves for this year!"]
		pending_or_active_leave = emp.has_pending_or_active_leave(start_date, end_date)
		if pending_or_active_leave[0] is True:
			return [False, pending_or_active_leave[1]]
		return [True, "Can request a leave"]

	def can_update_leave(self, leave, emp):
		if (leave.created_by == emp) or (
			leave.created_by is None and leave.employee == emp):
			return True
		return False

	def can_view_leave(self, leave, emp):
		if (leave.employee == emp) is True or (
			leave.employee.supervisor == emp) is True or (
				leave.employee.department and leave.employee.department.hod == emp
				) is True or (emp.is_hr is True and leave.employee.is_md is False) or emp.is_md is True:
			return True
		return False


class LeaveAdminManager(LeaveManager):
	def create(self, **leaves_data):
		admin = leaves_data.get("created_by")
		emp = leaves_data.get("employee")
		
		employee = Employee.objects.employees(admin).filter(user=emp.user).first()

		if employee is None:
			raise ValueError("employee does not exist")
		if admin is None:
			raise ValueError("admin did not make this action")
		if admin.user.is_staff is False:
			raise ValueError("only admins can make this action")

		if admin.is_md is True:
			leaves_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "N", "a_md": "A" })
		elif admin.is_hr is True:
			leaves_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "A", "a_md": "P" })
		elif admin.is_hod is True:
			leaves_data.update({ "a_s": "N", "a_hod": "A", "a_hr": "P", "a_md": "P" })
		elif admin.is_supervisor is True:
			leaves_data.update({ "a_s": "A", "a_hod": "P", "a_hr": "P", "a_md": "P" })

		return super().create(do_check=False, **leaves_data)

	def can_amend_leave(self, emp, leave):
		if leave.status == "A":
			return [False, "Leave has already been approved by the MD."]
		elif leave.status == "D":
			db = "the Manager Director"
			if leave.a_md == "D":
				db = "the Manager Director"
			elif leave.a_hr == "D":
				db = "the Human Resource Manager"
			elif leave.a_hod == "D" and leave.employee.department is not None:
				db = f"the Head Of Department for {leave.employee.department.name.capitalize()}"
			else:
				db = f"{leave.employee.user.get_full_name().capitalize()}'s supervisor"
			return [False, f"Leave has already been denied by {db}."]
		elif emp.is_md:
			return [True, "Can amend leave"]
		elif emp.is_hr:
			return [True, "Can amend leave"]
		elif emp.is_hod and leave.a_hr != "A" and leave.employee.department is not None and (
			leave.employee.department.hod == emp):
			return [True, "Can amend leave"]
		elif emp.is_supervisor and leave.employee.supervisor == emp and (
			leave.a_hod == "P" or leave.a_hod == "N") and ( 
			leave.a_hr == "P") and leave.a_md == "P":
				return [True, "Can amend leave"]
		return [False, "Leave has already been approved by an admin of higher rank. Please inform the Human Resource Manager in case of an error"]

	def get_queryset(self):
		return LeaveAdminQuerySet(self.model, using=self._db)

	def leaves(self, emp):
		return self.get_queryset().get_leaves(emp)


class OvertimeManager(models.Manager):
	def create(self, do_check=True, **overtime_data):
		emp = overtime_data.get('employee')
		date = overtime_data.get('date')
		hours = overtime_data.get('hours')
		
		if not date:
			raise ValidationError({ "date": "The start date must be set" })

		if not hours or hours < 1 or hours > 7:
			raise ValidationError({ 
				"hours": "Hours must be set, must not be less than 1 and greater than 7" })

		current_date = now().date()
		if (date - current_date).days < 0:
			raise ValidationError({ "date": "Start date must be a present or future date" })

		if emp.has_overtime(date):
			raise ValidationError({"date": 
				"You already have an approved overtime request specified for this date"})

		if emp.has_pending_overtime(date):
			raise ValidationError({"date": 
				"You have a pending overtime request specified for this date"})

		close_time = emp.get_open_and_close_time(date).get('close')
		if close_time.hour + hours > 23:
			raise ValidationError({ "hours": 
				f"You can only request overtime for no more than {23 - close_time.hour} hours." })

		[valid, reason] = self.can_request_overtime(emp, date)
		if valid is False:
			raise ValidationError({"detail": reason})

		if do_check:
			if emp.supervisor is None:
				overtime_data.update({ "a_s": "N", "a_hod": "P", "a_hr": "P", "a_md": "P" })
			if emp.get_hod() is None:
				overtime_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "P", "a_md": "P" })
			if emp.get_hod() == emp:
				overtime_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "P", "a_md": "P" })
			if emp.is_hr is True:
				overtime_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "N", "a_md": "P" })
			if emp.is_md is True:
				overtime_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "N", "a_md": "A" })
		return super().create(**overtime_data)

	def get_queryset(self):
		return OvertimeQuerySet(self.model, using=self._db)

	def filter_by_date(self, emp, _from, _to):
		return self.get_queryset().get_overtime_by_date(emp, _from, _to)

	def can_request_overtime(self, emp, date):
		if emp.user.is_active is False:
			return [False, "Employee is Inactive!"]
		if emp.has_overtime(date):
			return [False, "You already have an approved overtime for this date!"]
		if emp.has_pending_overtime(date):
			return [False, "You have a pending overtime request specified for this date"]
		if emp.is_on_leave is True:
			return [False, "Currently on leave!"]
		active_leave = emp.has_active_leave(date,date)
		if active_leave:
			return [False, "You will be or are on leave on specified date"]
		return [True, "Can request overtime"]

	def can_update_overtime(self, overtime, emp):
		if (overtime.created_by == emp) or (
			overtime.created_by is None and overtime.employee == emp):
			return True
		return False

	def can_view_overtime(self, overtime, emp):
		if (overtime.employee == emp) is True or (
			overtime.employee.supervisor == emp) is True or (
				overtime.employee.department and overtime.employee.department.hod == emp
				) is True or (emp.is_hr is True and overtime.employee.is_md is False) or emp.is_md is True:
			return True
		return False


class OvertimeAdminManager(OvertimeManager):
	def create(self, **overtime_data):
		admin = overtime_data.get("created_by")
		emp = overtime_data.get("employee")
		
		employee = Employee.objects.employees(admin).filter(user=emp.user).first()

		if employee is None:
			raise ValueError("employee does not exist")
		if admin is None:
			raise ValueError("admin did not make this action")
		if admin.user.is_staff is False:
			raise ValueError("only admins can make this action")

		if admin.is_md is True:
			overtime_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "N", "a_md": "A" })
		elif admin.is_hr is True:
			overtime_data.update({ "a_s": "N", "a_hod": "N", "a_hr": "A", "a_md": "P" })
		elif admin.is_hod is True:
			overtime_data.update({ "a_s": "N", "a_hod": "A", "a_hr": "P", "a_md": "P" })
		elif admin.is_supervisor is True:
			overtime_data.update({ "a_s": "A", "a_hod": "P", "a_hr": "P", "a_md": "P" })

		return super().create(do_check=False, **overtime_data)

	def can_amend_overtime(self, emp, overtime):
		if overtime.status == "A":
			return [False, "Overtime has already been approved by the MD."]
		elif overtime.status == "D":
			db = "the Manager Director"
			if overtime.a_md == "D":
				db = "the Manager Director"
			elif overtime.a_hr == "D":
				db = "the Human Resource Manager"
			elif overtime.a_hod == "D" and overtime.employee.department is not None:
				db = f"the Head Of Department for {overtime.employee.department.name.capitalize()}"
			else:
				db = f"{overtime.employee.user.get_full_name().capitalize()}'s supervisor"
			return [False, f"Overtime has already been denied by {db}."]
		elif emp.is_md:
			return [True, "Can amend overtime"]
		elif emp.is_hr:
			return [True, "Can amend overtime"]
		elif emp.is_hod and overtime.a_hr != "A" and overtime.employee.department is not None and (
			overtime.employee.department.hod == emp):
			return [True, "Can amend overtime"]
		elif emp.is_supervisor and overtime.employee.supervisor == emp and (
			overtime.a_hod == "P" or overtime.a_hod == "N") and ( 
			overtime.a_hr == "P") and overtime.a_md == "P":
				return [True, "Can amend overtime"]
		return [False, "Overtime has already been approved by an admin of higher rank. Please inform the Human Resource Manager in case of an error"]

	def get_queryset(self):
		return OvertimeAdminQuerySet(self.model, using=self._db)

	def overtimes(self, emp):
		return self.get_queryset().get_overtimes(emp)



