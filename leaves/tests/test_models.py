from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from rest_framework.exceptions import ValidationError

from common.utils import get_instance
from leaves.models import Leave, Overtime
from notifications.models import Notification

from .test_setup import get_date, TestSetUp


User = get_user_model()

global_start_date = get_date()
global_end_date = get_date(1)


""" Leave Model Tests """
class LeaveTests(TestSetUp):
	def test_create_leave_by_employee(self):
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		leave = Leave.objects.create(
			employee=self.employee, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.supervisor.user.email)
		self.assertEqual(leave.a_s, "P")
		self.assertEqual(leave.a_hod, "P")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0])
		self.assertTrue(Leave.objects.can_view_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))
		self.assertTrue(Leave.objects.can_update_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hod))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hr))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.md))

	def test_create_leave_by_employee1(self):
		leave = Leave.objects.create(
			employee=self.employee1, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes")
		email = mail.outbox[0]

		notification = get_instance(Notification, {"message_id": leave.id, "_type": "L",
			"recipient": self.hr})
		
		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.hr.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertIsNotNone(notification)
		self.assertTrue(Leave.objects.can_view_leave(leave, self.employee1))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))

		leave.delete()
		_notification = get_instance(Notification, {"message_id": leave.id, "_type": "L",
			"recipient": self.hr})
		self.assertIsNone(_notification)


	def test_create_leave_by_supervisor(self):
		leave = Leave.objects.create(
			employee=self.supervisor, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.hod.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "P")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee1))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))

	def test_create_leave_by_hod(self):
		leave = Leave.objects.create(
			employee=self.hod, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.hr.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee1))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))

	def test_create_leave_by_hr(self):
		leave = Leave.objects.create(
			employee=self.hr, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.md.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "N")
		self.assertEqual(leave.a_md, "P")
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee1))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))

	def test_create_leave_by_md(self):
		leave = Leave.objects.create(
			employee=self.md, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes")

		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "N")
		self.assertEqual(leave.a_md, "A")
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee1))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.hod))
		self.assertFalse(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))

	def test_create_leave_fails(self):
		with self.assertRaises(ValidationError):
			Leave.objects.create(
				employee=self.employee, leave_type="C", start_date=get_date(2),
				end_date=get_date(0), reason="Testing purposes")

		with self.assertRaises(ValidationError):
			Leave.objects.create(
				employee=self.employee, leave_type="C", start_date=get_date(-3),
				end_date=get_date(0), reason="Testing purposes")

		with self.assertRaises(ValidationError):
			Leave.objects.create(
				employee=self.employee, leave_type="C", start_date=global_start_date,
				end_date=global_start_date, reason="Testing purposes")


""" Leave Admin Model Tests"""
class LeaveAdminTests(TestSetUp):
	def test_create_leave_by_employee1_for_employee(self):
		""" Test that only staffs can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		with self.assertRaises(ValueError):
			Leave.admin_objects.create(
				employee=self.employee, leave_type="C", start_date=global_start_date,
				end_date=global_end_date, reason="Testing purposes", created_by=self.employee1)
		self.assertTrue(can_request)

	def test_create_leave_by_supervisor_for_employee1(self):
		""" Test that staffs cannot create a leave for employee they don't supervise"""
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		with self.assertRaises(ValueError):
			Leave.admin_objects.create(
				employee=self.employee1, leave_type="C", start_date=global_start_date,
				end_date=global_end_date, reason="Testing purposes", created_by=self.supervisor)
		self.assertTrue(can_request)

	def test_create_leave_by_hod_for_employee1(self):
		""" Test that staffs cannot create a leave for employee not in their department"""
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		with self.assertRaises(ValueError):
			Leave.admin_objects.create(
				employee=self.employee1, leave_type="C", start_date=global_start_date,
				end_date=global_end_date, reason="Testing purposes", created_by=self.hod)
		self.assertTrue(can_request)

	def test_create_leave_by_supervisor_for_employee(self):
		""" Test that supervisor can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes", created_by=self.supervisor)
		a_mail = mail.outbox[0]
		e_mail = mail.outbox[1]

		self.assertEqual(a_mail.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(a_mail.to[0], self.hod.user.email)
		self.assertEqual(e_mail.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(e_mail.to[0], self.employee.user.email)
		self.assertEqual(leave.a_s, "A")
		self.assertEqual(leave.a_hod, "P")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0])
		self.assertTrue(Leave.objects.can_view_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_update_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hod))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hr))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.md))

	def test_create_leave_by_hod_for_employee(self):
		""" Test that hod can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes", created_by=self.hod)
		a_mail = mail.outbox[0]
		e_mail = mail.outbox[1]

		self.assertEqual(a_mail.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(a_mail.to[0], self.hr.user.email)
		self.assertEqual(e_mail.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(e_mail.to[0], self.employee.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "A")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0])
		self.assertTrue(Leave.objects.can_view_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_update_leave(leave, self.hod))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hr))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.md))

	def test_create_leave_by_hr_for_employee(self):
		""" Test that HR can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes", created_by=self.hr)
		a_mail = mail.outbox[0]
		e_mail = mail.outbox[1]

		self.assertEqual(a_mail.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(a_mail.to[0], self.md.user.email)
		self.assertEqual(e_mail.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(e_mail.to[0], self.employee.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "A")
		self.assertEqual(leave.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0])
		self.assertTrue(Leave.objects.can_view_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_update_leave(leave, self.hr))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.md))

	def test_create_leave_by_md_for_employee(self):
		""" Test that md can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=global_start_date,
			end_date=global_end_date, reason="Testing purposes", created_by=self.md)
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.employee.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "N")
		self.assertEqual(leave.a_md, "A")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0])
		self.assertTrue(Leave.objects.can_view_leave(leave, self.employee))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.supervisor))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hod))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_view_leave(leave, self.md))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.employee))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.supervisor))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hod))
		self.assertFalse(Leave.objects.can_update_leave(leave, self.hr))
		self.assertTrue(Leave.objects.can_update_leave(leave, self.md))


""" Overtime Model Tests """
class OvertimeTests(TestSetUp):
	# Test to check authorized overtime if created by an employee
	def test_create_overtime_by_employee(self):
		overtime = Overtime.objects.create(
			employee=self.employee, overtime_type="O", date=global_start_date,
			hours=1, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(email.to[0], self.supervisor.user.email)
		self.assertEqual(overtime.a_s, "P")
		self.assertEqual(overtime.a_hod, "P")
		self.assertEqual(overtime.a_hr, "P")
		self.assertEqual(overtime.a_md, "P")
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))
		self.assertTrue(Overtime.objects.can_update_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hod))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hr))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.md))

	# Test create overtime by employee without a supervisor or hod.
	# Email should be sent directly to HR
	def test_create_overtime_by_employee1(self):
		overtime = Overtime.objects.create(
			employee=self.employee1, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes")
		email = mail.outbox[0]

		notification = get_instance(Notification, {"message_id": overtime.id, "_type": "O",
			"recipient": self.hr})
		
		self.assertEqual(email.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(email.to[0], self.hr.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "N")
		self.assertEqual(overtime.a_hr, "P")
		self.assertEqual(overtime.a_md, "P")
		self.assertIsNotNone(notification)
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.employee1))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))

		overtime.delete()
		_notification = get_instance(Notification, {"message_id": overtime.id, "_type": "O",
			"recipient": self.hr})
		self.assertIsNone(_notification)

	# Test create overtime for supervisor by supervisor
	def test_create_overtime_by_supervisor(self):
		overtime = Overtime.objects.create(
			employee=self.supervisor, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(email.to[0], self.hod.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "P")
		self.assertEqual(overtime.a_hr, "P")
		self.assertEqual(overtime.a_md, "P")
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee1))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))

	# Test create overtime by hod for hod
	def test_create_overtime_by_hod(self):
		overtime = Overtime.objects.create(
			employee=self.hod, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(email.to[0], self.hr.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "N")
		self.assertEqual(overtime.a_hr, "P")
		self.assertEqual(overtime.a_md, "P")
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee1))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))

	# Test create overtime by hr for hr
	def test_create_overtime_by_hr(self):
		overtime = Overtime.objects.create(
			employee=self.hr, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.md.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "N")
		self.assertEqual(overtime.a_hr, "N")
		self.assertEqual(overtime.a_md, "P")
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee1))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))

	# Test create overtime by md for md
	def test_create_overtime_by_md(self):
		overtime = Overtime.objects.create(
			employee=self.md, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes")

		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "N")
		self.assertEqual(overtime.a_hr, "N")
		self.assertEqual(overtime.a_md, "A")
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee1))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertFalse(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))

	# Test inactive employee and employee on leave cannot request overtime
	def test_inactive_employee_and_on_leave_cannot_request_overtime(self):
		# Set employee to inactive
		self.employee.user.is_active = False
		self.employee.user.save()

		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])

		# Change the employee back to active
		self.employee.user.is_active = True
		self.employee.user.save()

		self.assertTrue(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])

		# Create a leave for the employee
		leave = Leave.objects.create(employee=self.employee, leave_type="C", 
			start_date=global_start_date, end_date=global_end_date, reason="Testing purposes", a_md="A")

		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])

	# Overtime Failure Tests
	def test_create_overtime_fails(self):
		# Hours + Closing Time > 23 so overtime might spill over to the next day
		with self.assertRaises(ValidationError):
			Overtime.objects.create(
				employee=self.employee, overtime_type="C", date=get_date(2),
				hours=10, reason="Testing purposes")

		# Date < Current Date
		with self.assertRaises(ValidationError):
			Overtime.objects.create(
				employee=self.employee, overtime_type="C", date=get_date(-3),
				hours=1, reason="Testing purposes")


""" Overtime Admin Model Tests"""
class OvertimeAdminTests(TestSetUp):
	def test_create_overtime_by_employee1_for_employee(self):
		""" Test that only staffs can create a overtime """
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		with self.assertRaises(ValueError):
			Overtime.admin_objects.create(
				employee=self.employee, overtime_type="C", date=global_start_date,
				hours=1, reason="Testing purposes", created_by=self.employee1)
		self.assertTrue(can_request)

	def test_create_overtime_by_supervisor_for_employee1(self):
		""" Test that staffs cannot create an overtime for employee they don't supervise"""
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		with self.assertRaises(ValueError):
			Overtime.admin_objects.create(
				employee=self.employee1, overtime_type="C", date=global_start_date,
				hours=1, reason="Testing purposes", created_by=self.supervisor)
		self.assertTrue(can_request)

	def test_create_overtime_by_hod_for_employee1(self):
		""" Test that staffs cannot create an overtime for employee not in their department"""
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		with self.assertRaises(ValueError):
			Overtime.admin_objects.create(
				employee=self.employee1, overtime_type="C", date=global_start_date,
				hours=1, reason="Testing purposes", created_by=self.hod)
		self.assertTrue(can_request)

	def test_create_overtime_by_supervisor_for_employee(self):
		""" Test that supervisor can create an overtime """
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		overtime = Overtime.admin_objects.create(
			employee=self.employee, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes", created_by=self.supervisor)
		a_mail = mail.outbox[0]
		e_mail = mail.outbox[1]

		self.assertEqual(a_mail.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(a_mail.to[0], self.hod.user.email)
		self.assertEqual(e_mail.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(e_mail.to[0], self.employee.user.email)
		self.assertEqual(overtime.a_s, "A")
		self.assertEqual(overtime.a_hod, "P")
		self.assertEqual(overtime.a_hr, "P")
		self.assertEqual(overtime.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_update_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hod))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hr))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.md))

	def test_create_overtime_by_hod_for_employee(self):
		""" Test that hod can create a overtime """
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		overtime = Overtime.admin_objects.create(
			employee=self.employee, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes", created_by=self.hod)
		a_mail = mail.outbox[0]
		e_mail = mail.outbox[1]

		self.assertEqual(a_mail.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(a_mail.to[0], self.hr.user.email)
		self.assertEqual(e_mail.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(e_mail.to[0], self.employee.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "A")
		self.assertEqual(overtime.a_hr, "P")
		self.assertEqual(overtime.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_update_overtime(overtime, self.hod))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hr))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.md))

	def test_create_overtime_by_hr_for_employee(self):
		""" Test that HR can create an overtime """
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		overtime = Overtime.admin_objects.create(
			employee=self.employee, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes", created_by=self.hr)
		a_mail = mail.outbox[0]
		e_mail = mail.outbox[1]

		self.assertEqual(a_mail.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(a_mail.to[0], self.md.user.email)
		self.assertEqual(e_mail.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(e_mail.to[0], self.employee.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "N")
		self.assertEqual(overtime.a_hr, "A")
		self.assertEqual(overtime.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_update_overtime(overtime, self.hr))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.md))

	def test_create_overtime_by_md_for_employee(self):
		""" Test that md can create an overtime """
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		overtime = Overtime.admin_objects.create(
			employee=self.employee, overtime_type="C", date=global_start_date,
			hours=1, reason="Testing purposes", created_by=self.md)
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.OVERTIME_EMAIL)
		self.assertEqual(email.to[0], self.employee.user.email)
		self.assertEqual(overtime.a_s, "N")
		self.assertEqual(overtime.a_hod, "N")
		self.assertEqual(overtime.a_hr, "N")
		self.assertEqual(overtime.a_md, "A")
		self.assertTrue(can_request)
		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.employee))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.supervisor))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hod))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_view_overtime(overtime, self.md))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.employee))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.supervisor))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hod))
		self.assertFalse(Overtime.objects.can_update_overtime(overtime, self.hr))
		self.assertTrue(Overtime.objects.can_update_overtime(overtime, self.md))


