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


# Managers


class LeaveManager(models.Manager):
	def create(self, do_check=True, **leave_data):
		emp = leave_data.get('employee')
		start_date = leave_data.get('start_date')
		end_date = leave_data.get('end_date')

		[valid, reason] = self.can_request_leave(emp)
		if valid is False:
			raise ValidationError({"error": reason})

		if not start_date:
			raise ValidationError({ "start_date": "The start date must be set" })
		if not end_date:
			raise ValidationError({ "end_date": "The end date must be set" })
		if (end_date - start_date).days <= 0:
			raise ValidationError({ "end_date": "The number of days must be at least 1" })

		current_date = now().date()
		if (start_date - current_date).days < 0:
			raise ValidationError({ "start_date": "Start date must be a present or future date" })

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

	def can_request_leave(self, emp):
		if emp.user.is_active is False:
			return [False, "Employee is Inactive!"]
		if emp.has_pending_leave:
			return [False, "You already have a pending request!"]
		if emp.leaves_remaining <= 0:
			return [False, "You have run out of leaves for this year!"]
		if emp.is_on_leave is True:
			return [False, "Currently on leave!"]
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