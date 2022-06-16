import datetime
from django.core import mail

from common.utils import get_instance
from leaves.models import Leave, Overtime
from notifications.models import Notification
from .test_setup import get_date, TestSetUp


global_start_date = get_date()
global_end_date = get_date(1)


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
		can_request = Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0]
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.leaves_url, {
			"start_date": get_date(-1), "end_date": global_end_date,
			"leave_type": "C", "reason": "Testing Purposes"})
		response2 = self.client.post(self.leaves_url, {
			"start_date": global_start_date, "end_date": global_start_date,
			"leave_type": "C", "reason": "Testing Purposes"})
		response3 = self.client.post(self.leaves_url, {
			"end_date": global_start_date, "leave_type": "C", "reason": "Testing Purposes"})
		response4 = self.client.post(self.leaves_url, {
			"start_date": global_start_date, "leave_type": "C", "reason": "Testing Purposes"})
		response5 = self.client.post(self.leaves_url, {
			"start_date": global_start_date, "end_date": global_end_date,
			"leave_type": "C", "reason": "Testing Purposes"})
		response6 = self.client.post(self.leaves_url, {
			"start_date": global_start_date, "end_date": global_end_date,
			"leave_type": "C", "reason": "Testing Purposes"})

		leave = get_instance(Leave, {"employee": self.employee, "a_md": "P"})

		self.assertTrue(can_request)
		self.assertEqual(response1.status_code, 400)
		self.assertEqual(response2.status_code, 400)
		self.assertEqual(response3.status_code, 400)
		self.assertEqual(response4.status_code, 400)
		self.assertEqual(response5.status_code, 201)
		self.assertEqual(response6.status_code, 400)
		self.assertFalse(Leave.objects.can_request_leave(self.employee, global_start_date, global_end_date)[0])
		self.assertIsNotNone(leave)


""" Leave Detail View Tests """
class LeaveDetailViewTests(TestSetUp):
	def test_get_leave_by_required_personnel(self):
		leave = Leave.objects.create(employee=self.employee, start_date=global_start_date,
			end_date=global_end_date, reason="Testing Purposes")

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
		leave1 = Leave.objects.create(employee=self.employee, start_date=global_start_date, 
			end_date=global_end_date, reason="This is the last season")
		leave2 = Leave.objects.create(employee=self.employee1, start_date=global_start_date,
			end_date=global_end_date, reason="This is the last season")

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
			"start_date": global_start_date, "end_date": global_end_date, "leave_type": "C",
			"reason": "Testing Purposes", "employee": self.employee.id})

		response3 = self.client.post(self.leaves_admin_url, {
			"start_date": global_start_date, "end_date": global_end_date, "leave_type": "C",
			"reason": "Testing Purposes", "employee": self.employee.id})

		leave = get_instance(Leave, {"employee": self.employee, "created_by": self.hr,"a_md": "P"})

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 201)
		self.assertEqual(response3.status_code, 400)
		self.assertIsNotNone(leave)


""" Leave Admin Detail View Tests """
class LeaveAdminDetailViewTests(TestSetUp):
	def test_update_leave_by_unauthenticated_user(self):
		leave = Leave.objects.create(employee=self.employee, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")
		response = self.client.patch(leave.get_admin_absolute_url())
		self.assertEqual(response.status_code, 401)

	def test_update_leave_by_non_staff_user(self):
		leave = Leave.objects.create(employee=self.employee, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response = self.client.patch(leave.get_admin_absolute_url())
		self.assertEqual(response.status_code, 403)

	def test_update_leave_by_staff_user_but_not_required(self):
		leave = Leave.objects.create(employee=self.employee1, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response1 = self.client.patch(leave.get_admin_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response2 = self.client.patch(leave.get_admin_absolute_url())

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)

	def test_update_leave_by_staff_user_thats_required_but_wrong_action(self):
		leave = Leave.objects.create(employee=self.employee1, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")
		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response = self.client.patch(leave.get_admin_absolute_url(), {
			"approval": "denid"}, format="json")
		self.assertEqual(response.status_code, 400)

	def test_update_leave_by_staff_user_thats_required(self):
		leave = Leave.objects.create(employee=self.employee1, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response1 = self.client.patch(leave.get_admin_absolute_url(), {"approval": "denied"})
		instance1 = get_instance(Leave, {"id": leave.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response2 = self.client.patch(leave.get_admin_absolute_url(), {"approval": "approved"})

		leave2 = Leave.objects.create(employee=self.employee1, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response3 = self.client.patch(leave2.get_admin_absolute_url(), {"approval": "approved"})
		instance2 = get_instance(Leave, {"id": leave2.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response4 = self.client.patch(leave2.get_admin_absolute_url(), {"approval": "denied"})
		instance3 = get_instance(Leave, {"id": leave2.id})

		leave3 = Leave.objects.create(employee=self.employee1, start_date=global_start_date,
			end_date=global_end_date, reason="This is for test purposes")

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


""" Overtime List View Tests """
class OvertimeListViewTests(TestSetUp):
	def test_get_overtime_by_unauthenticated_user(self):
		response = self.client.get(self.overtime_url)
		self.assertEqual(response.status_code, 401)

	def test_get_overtime_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response = self.client.get(self.overtime_url)
		self.assertEqual(response.status_code, 200)

	def test_create_overtime_by_unauthenticated_user(self):
		response = self.client.post(self.overtime_url, {})
		self.assertEqual(response.status_code, 401)

	def test_create_overtime_by_authenticated_user(self):
		can_request = Overtime.objects.can_request_overtime(self.employee, global_start_date)[0]
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.overtime_url, {
			"date": get_date(-1), "hours": 1,
			"overtime_type": "C", "reason": "Testing Purposes"})
		response2 = self.client.post(self.overtime_url, {
			"date": global_start_date, "overtime_type": "C", "reason": "Testing Purposes"})
		response3 = self.client.post(self.overtime_url, {
			"hours": 1, "overtime_type": "C", "reason": "Testing Purposes"})
		response4= self.client.post(self.overtime_url, {
			"date": global_start_date, "hours": 1,
			"overtime_type": "C", "reason": "Testing Purposes"})
		response5 = self.client.post(self.overtime_url, {
			"date": global_start_date, "hours": 1,
			"overtime_type": "C", "reason": "Testing Purposes"})

		overtime = get_instance(Overtime, {"employee": self.employee, "a_md": "P"})

		self.assertTrue(can_request)
		self.assertEqual(response1.status_code, 400)
		self.assertEqual(response2.status_code, 400)
		self.assertEqual(response3.status_code, 400)
		self.assertEqual(response4.status_code, 201)
		self.assertEqual(response5.status_code, 400)
		self.assertFalse(Overtime.objects.can_request_overtime(self.employee, global_start_date)[0])
		self.assertIsNotNone(overtime)


""" Overtime Detail View Tests """
class OvertimeDetailViewTests(TestSetUp):
	def test_get_overtime_by_required_personnel(self):
		overtime = Overtime.objects.create(employee=self.employee, date=global_start_date,
			hours=1, reason="Testing Purposes")

		notification = get_instance(Notification, {"message_id": overtime.id, "_type": "O",
			"recipient": self.supervisor, "read": False})
		
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.get(overtime.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.employee1.user.email, "password": "Passing1234"})
		response2 = self.client.get(overtime.get_absolute_url())		

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response3 = self.client.get(overtime.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response4 = self.client.get(overtime.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response5 = self.client.get(overtime.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.get(overtime.get_absolute_url())
		
		_notification = get_instance(Notification, {"message_id": overtime.id, "_type": "O",
			"recipient": self.supervisor, "read": True})

		self.assertIsNotNone(notification)
		self.assertIsNotNone(_notification)
		self.assertEqual(response1.status_code, 200)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 200)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 200)
		self.assertEqual(response6.status_code, 200)


""" Overtime Admin List View Tests """
class OvertimeAdminListViewTests(TestSetUp):
	def test_get_admin_overtime_by_unauthenticated_user(self):
		response = self.client.get(self.overtime_admin_url)
		self.assertEqual(response.status_code, 401)

	def test_get_admin_overtime_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.overtime_admin_url)

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.get(self.overtime_admin_url)

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.get(self.overtime_admin_url)

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 200)
		self.assertEqual(response3.status_code, 200)
	
	def test_get_admin_overtime_by_admin_users(self):
		overtime1 = Overtime.objects.create(employee=self.employee, date=global_start_date, 
			hours=1, overtime_type="V", reason="This is the last season")
		overtime2 = Overtime.objects.create(employee=self.employee1, date=global_start_date,
			hours=1, overtime_type="V", reason="This is the last season")

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.overtime_admin_url)
		overtime1.a_s = "D"; overtime1.save()

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response2 = self.client.get(self.overtime_admin_url)
		overtime1.a_s = "A"; overtime1.a_hod = "D"; overtime1.save()
		response3 = self.client.get(self.overtime_admin_url)

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response4 = self.client.get(self.overtime_admin_url)
		overtime1.a_hod = "A"; overtime1.save()
		response5 = self.client.get(self.overtime_admin_url)
		overtime1.a_hr = "D"; overtime1.save(); overtime2.a_hr = "D"; overtime2.save()

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.get(self.overtime_admin_url)
		overtime1.a_hr = "A"; overtime1.save(); overtime2.a_hr = "A"; overtime2.save()
		response7 = self.client.get(self.overtime_admin_url)

		self.assertEqual(len(response1.data['results']), 1)
		self.assertEqual(len(response2.data['results']), 0)
		self.assertEqual(len(response3.data['results']), 1)
		self.assertEqual(len(response4.data['results']), 1)
		self.assertEqual(len(response5.data['results']), 2)
		self.assertEqual(len(response6.data['results']), 0)		
		self.assertEqual(len(response7.data['results']), 2)

	def test_create_overtime_admin_by_unauthenticated_user(self):
		response = self.client.post(self.overtime_admin_url, {})
		self.assertEqual(response.status_code, 401)

	def test_create_overtime_admin_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.overtime_admin_url, {})

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response2 = self.client.post(self.overtime_admin_url, {
			"date": global_start_date, "hours": 1, "overtime_type": "C",
			"reason": "Testing Purposes", "employee": self.employee.id})

		response3 = self.client.post(self.overtime_admin_url, {
			"date": global_start_date, "hours": 1, "overtime_type": "C",
			"reason": "Testing Purposes", "employee": self.employee.id})

		overtime = get_instance(Overtime, {"employee": self.employee, "created_by": self.hr,"a_md": "P"})

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 201)
		self.assertEqual(response3.status_code, 400)
		self.assertIsNotNone(overtime)


""" Overtime Admin Detail View Tests """
class OvertimeAdminDetailViewTests(TestSetUp):
	def test_update_overtime_by_unauthenticated_user(self):
		overtime = Overtime.objects.create(employee=self.employee, date=global_start_date,
			hours=1, overtime_type="V", reason="This is for test purposes")
		response = self.client.patch(overtime.get_admin_absolute_url())
		self.assertEqual(response.status_code, 401)

	def test_update_overtime_by_non_staff_user(self):
		overtime = Overtime.objects.create(employee=self.employee, date=global_start_date,
			hours=1, reason="This is for test purposes")
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response = self.client.patch(overtime.get_admin_absolute_url())
		self.assertEqual(response.status_code, 403)

	def test_update_overtime_by_staff_user_but_not_required(self):
		overtime = Overtime.objects.create(employee=self.employee1, date=global_start_date,
			hours=1, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response1 = self.client.patch(overtime.get_admin_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response2 = self.client.patch(overtime.get_admin_absolute_url())

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)

	def test_update_overtime_by_staff_user_thats_required_but_wrong_action(self):
		overtime = Overtime.objects.create(employee=self.employee1, date=global_start_date,
			hours=1, reason="This is for test purposes")
		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response = self.client.patch(overtime.get_admin_absolute_url(), {
			"approval": "denid"}, format="json")
		self.assertEqual(response.status_code, 400)

	def test_update_overtime_by_staff_user_thats_required(self):
		overtime = Overtime.objects.create(employee=self.employee1, date=global_start_date,
			hours=1, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response1 = self.client.patch(overtime.get_admin_absolute_url(), {"approval": "denied"})
		instance1 = get_instance(Overtime, {"id": overtime.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response2 = self.client.patch(overtime.get_admin_absolute_url(), {"approval": "approved"})

		overtime2 = Overtime.objects.create(employee=self.employee1, date=global_start_date,
			hours=1, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response3 = self.client.patch(overtime2.get_admin_absolute_url(), {"approval": "approved"})
		instance2 = get_instance(Overtime, {"id": overtime2.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response4 = self.client.patch(overtime2.get_admin_absolute_url(), {"approval": "denied"})
		instance3 = get_instance(Overtime, {"id": overtime2.id})

		overtime3 = Overtime.objects.create(employee=self.employee1, date=global_start_date,
			hours=1, reason="This is for test purposes")

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response5 = self.client.patch(overtime3.get_admin_absolute_url(), {"approval": "approved"})
		instance4 = get_instance(Overtime, {"id": overtime3.id})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.patch(overtime3.get_admin_absolute_url(), {"approval": "approved"})
		instance5 = get_instance(Overtime, {"id": overtime3.id})

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


