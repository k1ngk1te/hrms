import datetime
from django.core import mail

from common.utils import get_instance
from leaves.models import Leave
from notifications.models import Notification
from .test_setup import get_date, TestSetUp


""" Leave List View Tests """
class LeaveListViewTests(TestSetUp):
	def test_get_leaves_by_unauthenticated_user(self):
		response = self.client.get(self.leaves_url)
		self.assertEqual(response.status_code, 401)

	def test_get_leaves_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response = self.client.get(self.leaves_url)
		self.assertEqual(response.status_code, 200)

	def test_create_leave_by_unauthenticated_user(self):
		response = self.client.post(self.leaves_url, {})
		self.assertEqual(response.status_code, 401)

	def test_create_leave_by_authenticated_user(self):
		can_request = Leave.objects.can_request_leave(self.employee)[0]
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.leaves_url, {
			"start_date": get_date(-1), "end_date": get_date(1),
			"leave_type": "C", "reason": "Testing Purposes"})
		response2 = self.client.post(self.leaves_url, {
			"start_date": get_date(), "end_date": get_date(),
			"leave_type": "C", "reason": "Testing Purposes"})
		response3 = self.client.post(self.leaves_url, {
			"end_date": get_date(), "leave_type": "C", "reason": "Testing Purposes"})
		response4 = self.client.post(self.leaves_url, {
			"start_date": get_date(), "leave_type": "C", "reason": "Testing Purposes"})
		response5 = self.client.post(self.leaves_url, {
			"start_date": get_date(), "end_date": get_date(1),
			"leave_type": "C", "reason": "Testing Purposes"})
		response6 = self.client.post(self.leaves_url, {
			"start_date": get_date(), "end_date": get_date(1),
			"leave_type": "C", "reason": "Testing Purposes"})

		leave = get_instance(Leave, {"employee": self.employee, "a_md": "P"})

		self.assertTrue(can_request)
		self.assertEqual(response1.status_code, 400)
		self.assertEqual(response2.status_code, 400)
		self.assertEqual(response3.status_code, 400)
		self.assertEqual(response4.status_code, 400)
		self.assertEqual(response5.status_code, 201)
		self.assertEqual(response6.status_code, 400)
		self.assertFalse(Leave.objects.can_request_leave(self.employee)[0])
		self.assertIsNotNone(leave)


""" Leave Detail View Tests """
class LeaveDetailViewTests(TestSetUp):
	def test_get_leave_by_required_personnel(self):
		leave = Leave.objects.create(employee=self.employee, start_date=get_date(),
			end_date=get_date(1), reason="Testing Purposes")

		notification = get_instance(Notification, {"message_id": leave.id, "_type": "L",
			"recipient": self.supervisor, "read": False})
		
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.get(leave.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.employee1.user.email, "password": "Passing1234"})
		response2 = self.client.get(leave.get_absolute_url())		

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response3 = self.client.get(leave.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response4 = self.client.get(leave.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response5 = self.client.get(leave.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.get(leave.get_absolute_url())
		
		_notification = get_instance(Notification, {"message_id": leave.id, "_type": "L",
			"recipient": self.supervisor, "read": True})

		self.assertIsNotNone(notification)
		self.assertIsNotNone(_notification)
		self.assertEqual(response1.status_code, 200)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 200)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 200)
		self.assertEqual(response6.status_code, 200)


""" Leave Admin List View Tests """
class LeaveAdminListViewTests(TestSetUp):
	def test_get_admin_leaves_by_unauthenticated_user(self):
		response = self.client.get(self.leaves_admin_url)
		self.assertEqual(response.status_code, 401)

	def test_get_admin_leaves_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.leaves_admin_url)

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.get(self.leaves_admin_url)

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.get(self.leaves_admin_url)

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 200)
		self.assertEqual(response3.status_code, 200)
	
	def test_get_admin_leave_by_admin_users(self):
		leave1 = Leave.objects.create(employee=self.employee, start_date=get_date(), 
			end_date=get_date(1), reason="This is the last season")
		leave2 = Leave.objects.create(employee=self.employee1, start_date=get_date(),
			end_date=get_date(1), reason="This is the last season")

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.leaves_admin_url)
		leave1.a_s = "D"; leave1.save()

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response2 = self.client.get(self.leaves_admin_url)
		leave1.a_s = "A"; leave1.a_hod = "D"; leave1.save()
		response3 = self.client.get(self.leaves_admin_url)

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response4 = self.client.get(self.leaves_admin_url)
		leave1.a_hod = "A"; leave1.save()
		response5 = self.client.get(self.leaves_admin_url)
		leave1.a_hr = "D"; leave1.save(); leave2.a_hr = "D"; leave2.save()

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.get(self.leaves_admin_url)
		leave1.a_hr = "A"; leave1.save(); leave2.a_hr = "A"; leave2.save()
		response7 = self.client.get(self.leaves_admin_url)

		self.assertEqual(len(response1.data['results']), 1)
		self.assertEqual(len(response2.data['results']), 0)
		self.assertEqual(len(response3.data['results']), 1)
		self.assertEqual(len(response4.data['results']), 1)
		self.assertEqual(len(response5.data['results']), 2)
		self.assertEqual(len(response6.data['results']), 0)		
		self.assertEqual(len(response7.data['results']), 2)

	def test_create_leave_admin_by_unauthenticated_user(self):
		response = self.client.post(self.leaves_admin_url, {})
		self.assertEqual(response.status_code, 401)

	def test_create_leave_admin_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.leaves_admin_url, {})

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response2 = self.client.post(self.leaves_admin_url, {
			"start_date": get_date(), "end_date": get_date(1), "leave_type": "C",
			"reason": "Testing Purposes", "employee": self.employee.id})

		response3 = self.client.post(self.leaves_admin_url, {
			"start_date": get_date(), "end_date": get_date(1), "leave_type": "C",
			"reason": "Testing Purposes", "employee": self.employee.id})

		leave = get_instance(Leave, {"employee": self.employee, "created_by": self.hr,"a_md": "P"})

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 201)
		self.assertEqual(response3.status_code, 400)
		self.assertIsNotNone(leave)


""" Leave Admin Detail View Tests """
class LeaveAdminDetailViewTests(TestSetUp):
	def test_update_leave_by_unauthenticated_user(self):
		leave = Leave.objects.create(employee=self.employee, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")
		response = self.client.patch(leave.get_admin_absolute_url())
		self.assertEqual(response.status_code, 401)

	def test_update_leave_by_non_staff_user(self):
		leave = Leave.objects.create(employee=self.employee, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response = self.client.patch(leave.get_admin_absolute_url())
		self.assertEqual(response.status_code, 403)

	def test_update_leave_by_staff_user_but_not_required(self):
		leave = Leave.objects.create(employee=self.employee1, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response1 = self.client.patch(leave.get_admin_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response2 = self.client.patch(leave.get_admin_absolute_url())

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)

	def test_update_leave_by_staff_user_thats_required_but_wrong_action(self):
		leave = Leave.objects.create(employee=self.employee1, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")
		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response = self.client.patch(leave.get_admin_absolute_url(), {
			"approval": "denid"}, format="json")
		self.assertEqual(response.status_code, 400)

	def test_update_leave_by_staff_user_thats_required(self):
		leave = Leave.objects.create(employee=self.employee1, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response1 = self.client.patch(leave.get_admin_absolute_url(), {"approval": "denied"})
		instance1 = get_instance(Leave, {"id": leave.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response2 = self.client.patch(leave.get_admin_absolute_url(), {"approval": "approved"})

		leave2 = Leave.objects.create(employee=self.employee1, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response3 = self.client.patch(leave2.get_admin_absolute_url(), {"approval": "approved"})
		instance2 = get_instance(Leave, {"id": leave2.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response4 = self.client.patch(leave2.get_admin_absolute_url(), {"approval": "denied"})
		instance3 = get_instance(Leave, {"id": leave2.id})

		leave3 = Leave.objects.create(employee=self.employee1, start_date=get_date(),
			end_date=get_date(1), reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response5 = self.client.patch(leave3.get_admin_absolute_url(), {"approval": "approved"})
		instance4 = get_instance(Leave, {"id": leave3.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.patch(leave3.get_admin_absolute_url(), {"approval": "approved"})
		instance5 = get_instance(Leave, {"id": leave3.id})

		self.assertEqual(response1.status_code, 200)
		self.assertEqual(response2.status_code, 400)
		self.assertEqual(response3.status_code, 200)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 200)
		self.assertEqual(response6.status_code, 200)
		self.assertEqual(instance1.status, "D")
		self.assertEqual(instance1.a_hr, "D")
		self.assertEqual(instance2.status, "P")
		self.assertEqual(instance2.a_hr, "A")
		self.assertEqual(instance3.status, "D")
		self.assertEqual(instance3.a_hr, "A")
		self.assertEqual(instance3.a_md, "D")
		self.assertEqual(instance4.status, "P")
		self.assertEqual(instance4.a_hr, "A")
		self.assertEqual(instance4.a_md, "P")
		self.assertEqual(instance5.status, "A")
		self.assertEqual(instance5.a_hr, "A")
		self.assertEqual(instance5.a_md, "A")


