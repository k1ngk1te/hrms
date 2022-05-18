from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from common.utils import get_instance
from employees.models import Department, Employee

User = get_user_model()


class DepartmentTests(TestCase):

	def test_create_department(self):
		user = User.objects.create(email="employee1@example.com")
		user.set_password("Passing1234")
		user.save()
		user2 = User.objects.create(email="emplouee@examop.com")
		employee = Employee.objects.create(user=user)
		employee2 = Employee.objects.create(user=user2)

		Department.objects.create(name="marketing", hod=employee)
		dep = get_instance(Department, {"name": "marketing", "hod": employee})
		dep2 = Department.objects.create(name="market1")
		dep2.hod = employee2
		dep2.save()

		employee2_again = Employee.objects.get(user=employee2.user)

		self.assertIsNotNone(dep)
		self.assertEqual(dep.name, "marketing")
		self.assertEqual(dep.hod.user.email, employee.user.email)
		self.assertEqual(employee.user.is_staff, True)
		self.assertEqual(employee.is_hod, True)
		self.assertEqual(dep2, employee2_again.department)

		with self.assertRaises(IntegrityError):
			Department.objects.create(name="marketing")

	def test_update_department(self):
		user1 = User.objects.create(email="employee1@exampl.com")
		user1.set_password("Passing1234")
		user1.save()
		employee1 = Employee.objects.create(user=user1)

		user2 = User.objects.create(email="employee2@exampl.com")
		user2.set_password("Passing1234")
		user2.save()
		employee2 = Employee.objects.create(user=user2)

		dep = Department.objects.create(name="marketing1", hod=employee1)

		self.assertIsNotNone(dep)
		self.assertEqual(dep.name, "marketing1")
		self.assertEqual(dep.hod.user.email, employee1.user.email)
		self.assertEqual(employee1.user.is_staff, True)
		self.assertEqual(employee1.is_hod, True)

		dep.hod = employee2
		dep.save()

		self.assertEqual(dep.hod.user.email, employee2.user.email)
		self.assertEqual(employee2.user.is_staff, True)
		self.assertEqual(employee2.is_hod, True)

		self.assertEqual(employee1.user.is_staff, False)
		self.assertEqual(employee1.is_hod, False)


class EmployeeTests(TestCase):
	def test_create_employee(self):
		user1 = User.objects.create(email="mark@example.com")
		user2 = User.objects.create(email="mark1@example.com")
		user3 = User.objects.create(email="mark2@example.com")
		user4 = User.objects.create(email="mark3@example.com")
		user5 = User.objects.create(email="mark4@example.com")

		employee1 = Employee.objects.create(user=user1)
		employee2 = Employee.objects.create(user=user2, supervisor=employee1)
		employee3 = Employee.objects.create(user=user3)
		employee4 = Employee.objects.create(user=user4, is_hr=True)
		employee5 = Employee.objects.create(user=user5, is_md=True)

		department = Department.objects.create(name="makingbeaf", hod=employee3)

		self.assertEqual(employee2.supervisor, employee1)
		self.assertFalse(employee2.user.is_staff)
		self.assertTrue(employee1.user.is_staff)
		self.assertTrue(employee1.is_supervisor)
		self.assertTrue(employee3.user.is_staff)
		self.assertTrue(employee3.is_hod)
		self.assertTrue(employee4.user.is_staff)
		self.assertTrue(employee4.is_hr)
		self.assertTrue(employee5.user.is_staff)
		self.assertTrue(employee5.is_md)

	def test_relinquish_employee_status(self):
		user = User.objects.create(email="mark4@example.com")
		user1 = User.objects.create(email="mark7@example.com")

		employee = Employee.objects.create(user=user, is_hr=True, is_md=True)
		employee1 = Employee.objects.create(user=user1, supervisor=employee)

		department = Department.objects.create(name="makingbea", hod=employee)

		employee.relinquish_status()

		self.assertFalse(employee.is_md)
		self.assertFalse(employee.is_hr)
		self.assertFalse(employee.is_hod)
		self.assertFalse(employee.is_supervisor)


