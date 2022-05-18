from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase

from employees.models import Employee


User = get_user_model()


class TestSetUp(APITestCase):

    def setUp(self):
        """ Initialise Variables """
        self.client = APIClient()
        self.login_url = reverse('rest_login')
        self.logout_url = reverse('rest_logout')
        self.user_data_url = reverse('rest_user_details')
        self.change_password_url = reverse('rest_password_change')
        self.profile_url = reverse('profile')
        # self.reset_password_url = reverse('rest_password_reset')
        # self.reset_password_confirm_url = reverse('rest_password_reset_confirm')
        # Test for email verification rest_verify_email

        self.user = User.objects.create(email="employee2@example.com")
        self.user.set_password("Passing1234")
        self.user.save()

        self.employee = Employee.objects.create(user=self.user)

        return super().setUp()

    def tearDown(self):
        return super().tearDown()
