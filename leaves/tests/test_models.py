from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from rest_framework.exceptions import ValidationError

from common.utils import get_instance
from leaves.models import Leave
from notifications.models import Notification

from .test_setup import get_date, TestSetUp


User = get_user_model()


""" Leave Model Tests """
class LeaveTests(TestSetUp):
	def test_create_leave_by_employee(self):
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		leave = Leave.objects.create(
			employee=self.employee, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes")
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.supervisor.user.email)
		self.assertEqual(leave.a_s, "P")
		self.assertEqual(leave.a_hod, "P")
		self.assertEqual(leave.a_hr, "P")
		self.assertEqual(leave.a_md, "P")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee)[0])
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
			employee=self.employee1, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes")
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
			employee=self.supervisor, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes")
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
			employee=self.hod, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes")
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
			employee=self.hr, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes")
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
			employee=self.md, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes")

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
				employee=self.employee, leave_type="C", start_date=get_date(),
				end_date=get_date(), reason="Testing purposes")


""" Leave Admin Model Tests"""
class LeaveAdminTests(TestSetUp):
	def test_create_leave_by_employee1_for_employee(self):
		""" Test that only staffs can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		with self.assertRaises(ValueError):
			Leave.admin_objects.create(
				employee=self.employee, leave_type="C", start_date=get_date(),
				end_date=get_date(1), reason="Testing purposes", created_by=self.employee1)
		self.assertTrue(can_request)

	def test_create_leave_by_supervisor_for_employee1(self):
		""" Test that staffs cannot create a leave for employee they don't supervise"""
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		with self.assertRaises(ValueError):
			Leave.admin_objects.create(
				employee=self.employee1, leave_type="C", start_date=get_date(),
				end_date=get_date(1), reason="Testing purposes", created_by=self.supervisor)
		self.assertTrue(can_request)

	def test_create_leave_by_hod_for_employee1(self):
		""" Test that staffs cannot create a leave for employee not in their department"""
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		with self.assertRaises(ValueError):
			Leave.admin_objects.create(
				employee=self.employee1, leave_type="C", start_date=get_date(),
				end_date=get_date(1), reason="Testing purposes", created_by=self.hod)
		self.assertTrue(can_request)

	def test_create_leave_by_supervisor_for_employee(self):
		""" Test that supervisor can create a leave """
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes", created_by=self.supervisor)
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
		self.assertFalse(Leave.objects.can_request_leave(self.employee)[0])
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
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes", created_by=self.hod)
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
		self.assertFalse(Leave.objects.can_request_leave(self.employee)[0])
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
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes", created_by=self.hr)
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
		self.assertFalse(Leave.objects.can_request_leave(self.employee)[0])
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
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		leave = Leave.admin_objects.create(
			employee=self.employee, leave_type="C", start_date=get_date(),
			end_date=get_date(1), reason="Testing purposes", created_by=self.md)
		email = mail.outbox[0]

		self.assertEqual(email.from_email, settings.LEAVE_EMAIL)
		self.assertEqual(email.to[0], self.employee.user.email)
		self.assertEqual(leave.a_s, "N")
		self.assertEqual(leave.a_hod, "N")
		self.assertEqual(leave.a_hr, "N")
		self.assertEqual(leave.a_md, "A")
		self.assertTrue(can_request)
		self.assertFalse(Leave.objects.can_request_leave(self.employee)[0])
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


