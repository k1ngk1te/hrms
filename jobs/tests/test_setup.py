from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase

from employees.models import Department, Employee
from jobs.models import Job

User = get_user_model()


class TestSetUp(APITestCase):

	def setUp(self):
		self.client = APIClient()
		self.login_url = reverse('rest_login')
		self.jobs_url = reverse('jobs')

		self.user1 = User.objects.create(email="md@example.com")
		self.user1.set_password("Passing1234")
		self.user1.save()

		self.user2 = User.objects.create(email="hr@example.com")
		self.user2.set_password("Passing1234")
		self.user2.save()

		self.user3 = User.objects.create(email="hod@example.com")
		self.user3.set_password("Passing1234")
		self.user3.save()

		self.user4 = User.objects.create(email="supervisor@example.com")
		self.user4.set_password("Passing1234")
		self.user4.save()

		self.user5 = User.objects.create(email="employee@example.com")
		self.user5.set_password("Passing1234")
		self.user5.save()

		self.md = Employee.objects.create(user=self.user1, is_md=True)
		self.hr = Employee.objects.create(user=self.user2, is_hr=True)
		self.hod = Employee.objects.create(user=self.user3)
		self.supervisor = Employee.objects.create(user=self.user4)
		self.employee = Employee.objects.create(user=self.user5)

		Department.objects.create(name="marketing101", hod=self.hod)

		self.employee.supervisor = self.supervisor
		self.employee.save()

		return super().setUp()

	def tearDown(self):
		return super().tearDown()
