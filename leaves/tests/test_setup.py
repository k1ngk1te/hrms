import datetime
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase

from employees.models import Department, Employee

User = get_user_model()


def get_date(no=None, string=False):
	if no is None:
		date = now().date()
		if string:
			return f"{date.year}-{date.month}-{date.day}"
		return date
	date = now().date() + datetime.timedelta(days=no)
	if string:
		return f"{date.year}-{date.month}-{date.day}"	
	return date

class TestSetUp(APITestCase):

	def setUp(self):
		self.client = APIClient()
		self.login_url = reverse('rest_login')
		self.leaves_url = reverse('leaves')
		self.leaves_admin_url = reverse('leaves-admin')
		self.overtime_url = reverse('overtime')
		self.overtime_admin_url = reverse('overtime-admin')

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

		self.user6 = User.objects.create(email="employee1@example.com")
		self.user6.set_password("Passing1234")
		self.user6.save()

		self.md = Employee.objects.create(user=self.user1, is_md=True)
		self.hr = Employee.objects.create(user=self.user2, is_hr=True)
		self.hod = Employee.objects.create(user=self.user3)
		self.department = Department.objects.create(name="marketing202", hod=self.hod)
		self.supervisor = Employee.objects.create(user=self.user4, department=self.department)
		
		self.employee = Employee.objects.create(user=self.user5, supervisor=self.supervisor,
			department=self.department)
		self.employee1 = Employee.objects.create(user=self.user6)

		return super().setUp()

	def tearDown(self):
		return super().tearDown()
