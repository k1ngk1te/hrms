import datetime
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.utils.timezone import now

from employees.models import Department, Employee
from .test_setup import get_date, TestSetUp

User = get_user_model()


""" Department List View Tests """
class DepartmentListViewTests(TestSetUp):
	def test_get_departments_by_unauthenticated_user(self):
		response = self.client.get(self.departments_url)
		self.assertEqual(response.status_code, 401)

	def test_get_departments_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.user5.email, "password": "Passing1234"})
		response1 = self.client.get(self.departments_url)

		self.client.post(self.login_url, {
			"email": self.user4.email, "password": "Passing1234"})
		response2 = self.client.get(self.departments_url)

		self.client.post(self.login_url, {
			"email": self.user3.email, "password": "Passing1234"})
		response3 = self.client.get(self.departments_url)

		self.client.post(self.login_url, {
			"email": self.user2.email, "password": "Passing1234"})
		response4 = self.client.get(self.departments_url)

		self.client.post(self.login_url, {
			"email": self.user1.email, "password": "Passing1234"})
		response5 = self.client.get(self.departments_url)

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 200)
		self.assertEqual(response3.status_code, 200)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 200)

	def test_create_department_by_unauthenticated_user(self):
		response = self.client.post(self.departments_url, {
			"name": "marketing102"
		})
		self.assertEqual(response.status_code, 401)
	
	def test_create_department_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.user5.email, "password": "Passing1234"})
		response1 = self.client.post(self.departments_url, {"name": "market"})

		self.client.post(self.login_url, {
			"email": self.user4.email, "password": "Passing1234"})
		response2 = self.client.post(self.departments_url, {"name": "market1"})

		self.client.post(self.login_url, {
			"email": self.user3.email, "password": "Passing1234"})
		response3 = self.client.post(self.departments_url, {"name": "market1"})

		self.client.post(self.login_url, {
			"email": self.user2.email, "password": "Passing1234"})
		response4 = self.client.post(self.departments_url, {"name": "market1"})

		try:
			dep1 = Department.objects.get(name="market1")
		except Department.DoesNotExist:
			raise ValueError("Market1 department does not exist")

		self.client.post(self.login_url, {
			"email": self.user1.email, "password": "Passing1234"})
		response5 = self.client.post(self.departments_url, {
			"name": "market2", "hod": {"id": self.employee1.id}}, format="json")
		response6 = self.client.post(self.departments_url, {"name": "market1"})
		response7 = self.client.post(self.departments_url, {
			"name": "market3", "hod": {"id": self.employee1.id}}, format="json")

		try:
			dep2 = Department.objects.get(name="market2")
		except Department.DoesNotExist:
			raise ValueError("Market2 department does not exist")

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 201)
		self.assertEqual(response5.status_code, 201)
		self.assertEqual(response6.status_code, 400)
		self.assertEqual(response7.status_code, 400)
		self.assertEqual(dep2.hod, self.employee1)
		self.assertIsNotNone(dep1)
		self.assertIsNotNone(dep2)
		self.assertTrue(self.employee1.user.is_staff)


""" Department Update View Tests """
class DepartmentUpdateViewTests(TestSetUp):
	def test_update_department_by_unauthenticated_user(self):
		department = Department.objects.create(name="marketTest1")
		response = self.client.put(department.get_absolute_url(), {})
		self.assertEqual(response.status_code, 401)

	def test_update_department_by_authenticated_user(self):
		department = Department.objects.create(name="marketTest", hod=self.employee1)
		self.assertTrue(self.employee1.user.is_staff)

		self.client.post(self.login_url, {
			"email": self.user5.email, "password": "Passing1234"})
		response1 = self.client.put(department.get_absolute_url(), {"name": "market1"})

		self.client.post(self.login_url, {
			"email": self.user4.email, "password": "Passing1234"})
		response2 = self.client.put(department.get_absolute_url(), {"name": "market1"})

		self.client.post(self.login_url, {
			"email": self.user3.email, "password": "Passing1234"})
		response3 = self.client.put(department.get_absolute_url(), {"name": "market1"})

		self.client.post(self.login_url, {
			"email": self.user2.email, "password": "Passing1234"})
		response4 = self.client.put(department.get_absolute_url(), {"name": "marketTest2"})

		dep1 = Department.objects.filter(name="markettest").first()

		self.client.post(self.login_url, {
			"email": self.user1.email, "password": "Passing1234"})
		response5 = self.client.put(department.get_absolute_url(), {
			"name": "marketTest3", "hod": {"id": self.employee2.id}}, format="json")

		dep2 = Department.objects.filter(name="markettest2").first()

		dep3 = Department.objects.filter(name="markettest3").first()

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 200)
		self.assertIsNotNone(dep3)
		self.assertEqual(dep3.hod, self.employee2)
		self.assertIsNone(dep1)
		self.assertIsNone(dep2)
		self.assertFalse(self.employee1.user.is_staff)
		self.assertTrue(self.employee2.user.is_staff)


""" Employee List View Tests """
class EmployeeListViewTests(TestSetUp):
	def test_get_employees_by_unauthenticated_user(self):
		response = self.client.get(self.employees_url)
		self.assertEqual(response.status_code, 401)

	def test_get_employees_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee1.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.employees_url)

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.get(self.employees_url)

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.get(self.employees_url)

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response4 = self.client.get(self.employees_url)

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response5 = self.client.get(self.employees_url)

		user = User(email="someone@amazon.com", is_admin=True)
		user.set_password("Passing1234")
		user.save()

		self.client.post(self.login_url, {
			"email": user.email, "password": "Passing1234"})
		response6 = self.client.get(self.employees_url)

		emp = Employee(user=user)
		emp.save()

		response7 = self.client.get(self.employees_url)

		# Reinitializing the hod instance
		hod = Employee.objects.get(user=self.hod.user)

		self.assertEqual(hod.department, self.department)
		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 200)
		self.assertEqual(len(response2.data['results']), 1)
		self.assertEqual(response3.status_code, 200)
		self.assertEqual(len(response3.data['results']), 4)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(len(response4.data['results']), 5)
		self.assertEqual(response5.status_code, 200)
		self.assertEqual(len(response5.data['results']), 6)
		self.assertEqual(response6.status_code, 403)
		self.assertEqual(response7.status_code, 200)
		self.assertEqual(len(response7.data['results']), 0)

	def test_create_employee_by_unauthenticated_user(self):
		response = self.client.post(self.employees_url, {})
		self.assertEqual(response.status_code, 401)

	def test_create_employee_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee1.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.employees_url, {})

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.post(self.employees_url, {})

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.post(self.employees_url, {})

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response4 = self.client.post(self.employees_url, {
			"user": {
				"email": "TesteR@teSt.testinG",
				"first_name": "tester",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": self.supervisor.id
			},
			"date_employed": "2022-03-18"
		}, format="json")

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response5 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.testinG",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": self.supervisor.id
			},
			"date_employed": "2022-03-18"
		}, format="json")		

		# Unique Error Failure Coz Employee was created in response 5 
		response6 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.tesTinG",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": self.supervisor.id
			},
			"date_employed": "2022-03-18"
		},format="json")

		self.supervisor.user.is_active = False
		self.supervisor.user.save()

		# Failure Coz Supervisor is not active
		response7 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.testinGa",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": self.supervisor.id
			},
			"date_employed": "2022-03-18"
		},format="json")

		# Failure Coz of Department not found
		response8 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.testinGa",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": 1000
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": self.supervisor.id
			},
			"date_employed": "2022-03-18"
		}, format="json")

		# Failure Coz of Job not found
		response9 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.testinGa",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": 1000
			},
			"supervisor": {
				"id": self.employee.id
			},
			"date_employed": "2022-03-18"
		}, format="json")

		# Failure Coz of Supervisor not found
		response10 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.testinGa",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": "emp1000"
			},
			"date_employed": "2022-03-18"
		}, format="json")

		# Failure Coz Of Invalid Gender
		response11 = self.client.post(self.employees_url, {
			"user": {
				"email": "Test@teSt.testinGba",
				"first_name": "test",
				"last_name": "test"
			},
			"profile": {
				"gender": "G",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department.id
			},
			"job": {
				"id": self.job.id
			},
			"supervisor": {
				"id": self.employee.id
			},
			"date_employed": "2022-03-18"
		}, format="json")

		try:
			Employee.objects.get(user__email="tester@test.testing")
		except Employee.DoesNotExist:
			raise IntegrityError("Employee tester@test.testing does not exist")

		try:
			Employee.objects.get(user__email="test@test.testing")
		except Employee.DoesNotExist:
			raise IntegrityError("Employee test@test.testing does not exist")

		with self.assertRaises(Employee.DoesNotExist):
			Employee.objects.get(user__email="test@test.testinga")

		with self.assertRaises(Employee.DoesNotExist):
			Employee.objects.get(user__email="test@test.testingba")

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 201)
		self.assertEqual(response5.status_code, 201)
		self.assertEqual(response6.status_code, 400)
		self.assertEqual(response7.status_code, 400)
		self.assertEqual(response8.status_code, 400)
		self.assertEqual(response9.status_code, 400)
		self.assertEqual(response10.status_code, 400)
		self.assertEqual(response11.status_code, 400)


""" Employee Detail View Tests """
class EmployeeDetailViewTests(TestSetUp):
	def test_get_employee_by_unauthenticated_user(self):
		response = self.client.get(self.employee.get_absolute_url())
		self.assertEqual(response.status_code, 401)

	def test_get_employee_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.employee.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.get(self.employee.get_absolute_url())
		response3 = self.client.get(self.employee1.get_absolute_url())
		response4 = self.client.get(self.supervisor.get_absolute_url())
		res1 = self.client.get(self.hod.get_absolute_url())
		res2 = self.client.get(self.hr.get_absolute_url())
		res3 = self.client.get(self.md.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response5 = self.client.get(self.employee.get_absolute_url())
		response6 = self.client.get(self.supervisor.get_absolute_url())
		response7 = self.client.get(self.hod.get_absolute_url())		
		res4 = self.client.get(self.hr.get_absolute_url())		
		res5 = self.client.get(self.md.get_absolute_url())		

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response8 = self.client.get(self.employee.get_absolute_url())
		response9 = self.client.get(self.supervisor.get_absolute_url())
		response10 = self.client.get(self.hod.get_absolute_url())
		res6 = self.client.get(self.hr.get_absolute_url())
		res7 = self.client.get(self.md.get_absolute_url())

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response11 = self.client.get(self.employee.get_absolute_url())
		response12 = self.client.get(self.supervisor.get_absolute_url())
		response13 = self.client.get(self.hod.get_absolute_url())
		response14 = self.client.get(self.hr.get_absolute_url())
		res8 = self.client.get(self.md.get_absolute_url())

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 200)
		self.assertEqual(response3.status_code, 404)
		self.assertEqual(response4.status_code, 404)
		self.assertEqual(response5.status_code, 200)
		self.assertEqual(response6.status_code, 200)
		self.assertEqual(response7.status_code, 404)
		self.assertEqual(response8.status_code, 200)
		self.assertEqual(response9.status_code, 200)
		self.assertEqual(response10.status_code, 200)
		self.assertEqual(response11.status_code, 200)
		self.assertEqual(response12.status_code, 200)
		self.assertEqual(response13.status_code, 200)
		self.assertEqual(response14.status_code, 200)
		self.assertEqual(res1.status_code, 404)
		self.assertEqual(res2.status_code, 404)
		self.assertEqual(res3.status_code, 404)
		self.assertEqual(res4.status_code, 404)
		self.assertEqual(res5.status_code, 404)
		self.assertEqual(res6.status_code, 404)
		self.assertEqual(res7.status_code, 404)
		self.assertEqual(res8.status_code, 404)

	def test_update_employee_by_unauthenticated_user(self):
		response = self.client.put(self.employee.get_absolute_url())
		self.assertEqual(response.status_code, 401)

	def test_update_employee_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.put(self.md.get_absolute_url(), {})

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.put(self.employee.get_absolute_url(), {})

		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.put(self.supervisor.get_absolute_url(), {})

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response4 = self.client.put(self.md.get_absolute_url(), {})
		response5 = self.client.put(self.employee.get_absolute_url(), {
			"user": {
				"email": "Emp@exAmPlE.coM",
				"first_name": "tester",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department2.id
			},
			"job": {
				"id": self.job2.id
			},
			"supervisor": {
				"id": self.employee1.id
			},
			"date_employed": "2022-03-18"
		}, format="json")
		response6 = self.client.put(self.employee2.get_absolute_url(), {
			"user": {
				"email": self.employee1.user.email,
				"first_name": "tester",
				"last_name": "test"
			},
			"department": {
				"id": self.department2.id
			},
			"job": {
				"id": self.job2.id
			},
			"supervisor": {
				"id": self.employee1.id
			},
			"date_employed": "2022-03-18"
		}, format="json")
		response7 = self.client.put(self.employee2.get_absolute_url(), {
			"user": {
				"email": "Emp@exAmPlE.coM",
				"first_name": "tester",
				"last_name": "test"
			},
			"department": {
				"id": 1000
			},
			"job": {
				"id": self.job2.id
			},
			"supervisor": {
				"id": self.employee1.id
			},
			"date_employed": "2022-03-18"
		}, format="json")
		response8 = self.client.put(self.employee2.get_absolute_url(), {
			"user": {
				"email": "Emp@exAmPlE.coM",
				"first_name": "tester",
				"last_name": "test"
			},
			"department": {
				"id": self.department2.id
			},
			"job": {
				"id": 1000
			},
			"supervisor": {
				"id": self.employee1.id
			},
			"date_employed": "2022-03-18"
		}, format="json")
		response9 = self.client.put(self.employee2.get_absolute_url(), {
			"user": {
				"email": "Emp@exAmPlE.coM",
				"first_name": "tester",
				"last_name": "test"
			},
			"department": {
				"id": self.department2.id
			},
			"job": {
				"id": self.job2.id
			},
			"supervisor": {
				"id": "emp1000"
			},
			"date_employed": "2022-03-18"
		}, format="json")

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response10 = self.client.put(self.hr.get_absolute_url(), {
			"user": {
				"email": "hr2@example.com",
				"first_name": "tester",
				"last_name": "test"
			},
			"profile": {
				"gender": "F",
				"date_of_birth": "2001-03-14",
				"phone": "+123 456 7890",
				"address": "This is Tester's home address",
				"state": "Los Angeles",
				"city": "New York"
			},
			"department": {
				"id": self.department2.id
			},
			"job": {
				"id": self.job2.id
			},
			"supervisor": {
				"id": self.employee1.id
			},
			"date_employed": "2022-03-18"
		}, format="json")

		with self.assertRaises(Employee.DoesNotExist):
			Employee.objects.get(user__email=self.employee.user.email)
		with self.assertRaises(Employee.DoesNotExist):
			Employee.objects.get(user__email=self.hr.user.email)

		try:
			Employee.objects.get(user__email="emp@example.com")
		except Employee.DoesNotExist:
			raise IntegrityError("User does not exist")
		try:
			Employee.objects.get(user__email="hr2@example.com")
		except Employee.DoesNotExist:
			raise IntegrityError("User does not exist")

		employee = Employee.objects.get(user__email="emp@example.com")

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 404)
		self.assertEqual(response5.status_code, 200)
		self.assertEqual(response6.status_code, 400)
		self.assertEqual(response7.status_code, 400)
		self.assertEqual(response8.status_code, 400)
		self.assertEqual(response9.status_code, 400)
		self.assertEqual(response10.status_code, 200)
		self.assertEqual(self.department2, employee.department)
		self.assertEqual(self.job2, employee.job)
		self.assertEqual(self.employee1, employee.supervisor)
		self.assertEqual(employee.user.profile.gender, "F")
		self.assertEqual(employee.user.profile.date_of_birth, datetime.date(2001, 3, 14))
		self.assertEqual(employee.date_employed, get_date())


""" Employee Change Password View Tests """

class EmployeeChangePasswordViewTests(TestSetUp):
	def test_employee_change_password_by_unauthenticated_user(self):
		response = self.client.post(self.employee_password_change, {})
		self.assertEqual(response.status_code, 401)

	def test_employee_change_password_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.employee_password_change, {})

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.post(self.employee_password_change, {})
		
		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.post(self.employee_password_change, {})

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})
		response4 = self.client.post(self.employee_password_change, {
			"email": self.employee.user.email,
			"new_password1": "Password0123",
			"new_password2": "Password0123"
		})
		response5 = self.client.post(self.employee_password_change, {
			"email": self.md.user.email,
			"new_password1": "Password",
			"new_password2": "Password"
		})

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response6 = self.client.post(self.employee_password_change, {
			"email": self.employee1.user.email,
			"new_password1": "Password0123",
			"new_password2": "Password0123"
		})
		response7 = self.client.post(self.employee_password_change, {
			"email": self.hr.user.email,
			"new_password1": "Password0123",
			"new_password2": "Password0123"
		})
		
		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 403)
		self.assertEqual(response6.status_code, 200)
		self.assertEqual(response7.status_code, 200)

		employee = Employee.objects.get(user=self.employee.user)
		employee1 = Employee.objects.get(user=self.employee1.user)
		hr = Employee.objects.get(user=self.hr.user)
		md = Employee.objects.get(user=self.md.user)

		self.assertTrue(employee.user.check_password("Password0123"))
		self.assertTrue(employee1.user.check_password("Password0123"))
		self.assertTrue(hr.user.check_password("Password0123"))
		self.assertTrue(md.user.check_password("Passing1234"))


""" Employee Deactivate View Tests """
class EmployeeDeactiveateViewTests(TestSetUp):
	def test_employee_deactivate_by_unauthenticated_user(self):
		response = self.client.post(self.employee_deactivate_url, {})
		self.assertEqual(response.status_code, 401)

	def test_employee_deactivate_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.post(self.employee_deactivate_url, {})

		self.client.post(self.login_url, {
			"email": self.supervisor.user.email, "password": "Passing1234"})
		response2 = self.client.post(self.employee_deactivate_url, {})
		
		self.client.post(self.login_url, {
			"email": self.hod.user.email, "password": "Passing1234"})
		response3 = self.client.post(self.employee_deactivate_url, {})

		self.client.post(self.login_url, {
			"email": self.hr.user.email, "password": "Passing1234"})

		res1 = self.client.post(self.employee_deactivate_url, {"email": self.employee.user.email})
		self.assertEqual(res1.status_code, 400)
		
		res2 = self.client.post(self.employee_deactivate_url, {
			"email": "someone@google.com", "action": "activate"})
		self.assertEqual(res2.status_code, 400)
		
		res3 = self.client.post(self.employee_deactivate_url, {"action": "deactivate"})
		self.assertEqual(res3.status_code, 400)
		
		res4 = self.client.post(self.employee_deactivate_url, {
			"email": self.employee.user.email, "action": "activated"})
		self.assertEqual(res4.status_code, 400)

		self.employee1.user.is_active = False
		self.employee1.user.save()

		r1 = self.client.post(self.employee_deactivate_url, {
			"email": self.employee1.user.email, "action": "deactivate"})
		self.assertEqual(r1.status_code, 400)

		r2 = self.client.post(self.employee_deactivate_url, {
			"email": self.employee2.user.email, "action": "activate"})
		self.assertEqual(r2.status_code, 400)

		r3 = self.client.post(self.employee_deactivate_url, {
			"email": self.hr.user.email, "action": "deactivate"})
		self.assertEqual(r3.status_code, 400)

		r4 = self.client.post(self.employee_deactivate_url, {
			"email": self.md.user.email, "action": "deactivate"})
		self.assertEqual(r4.status_code, 403)

		self.client.post(self.login_url, {
			"email": self.md.user.email, "password": "Passing1234"})
		response4 = self.client.post(self.employee_deactivate_url, {
			"email": self.hr.user.email, "action": "deactivate"})
		response5 = self.client.post(self.employee_deactivate_url, {
			"email": self.employee1.user.email, "action": "activate"})

		hr = Employee.objects.get(user__email=self.hr.user.email)

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 200)
		self.assertEqual(response5.status_code, 200)
		self.assertFalse(hr.user.is_staff)

