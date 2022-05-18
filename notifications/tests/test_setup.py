from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase

from employees.models import Employee

User = get_user_model()

class TestSetUp(APITestCase):

	def setUp(self):
		self.client = APIClient()
		self.login_url = reverse('rest_login')
		self.notifications_url = reverse('notifications')

		self.user1 = User.objects.create(email="employee@example.com")
		self.user1.set_password("Passing1234")
		self.user1.save()

		self.user2 = User.objects.create(email="employee2@example.com")
		self.user2.set_password("Passing1234")
		self.user2.save()
		
		self.employee = Employee.objects.create(user=self.user1)
		self.employee2 = Employee.objects.create(user=self.user2)

		return super().setUp()

	def tearDown(self):
		return super().tearDown()
