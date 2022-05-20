import datetime
from django.contrib.auth import get_user_model

from .test_setup import TestSetUp

User = get_user_model()



""" Login Tests """
class LoginTests(TestSetUp):
	""" Test the functionality of the Login API """

	def test_basic_login(self):
		"""Test login"""

		user = User.objects.create(email="john@smith.io")
		user.set_password("Response12345")
		user.save()

		response1 = self.client.post(self.login_url, {
			"email": "john@smith.io", "password": "Response12345" }, format="json")

		response2 = self.client.login(email="john@smith.io", password="Response12345")

		response3 = self.client.post(self.logout_url, {})

		self.assertEqual(response1.status_code, 200)
		self.assertEqual(response3.status_code, 200)
		self.assertTrue(response2)
		self.assertTrue(user.is_authenticated)

	def test_inactive_login(self):
		"""Test Failed Login For Inactive Users"""

		wayne = User.objects.create(email="wayne@smith.io")
		wayne.set_password("Response12345")
		wayne.is_active = False
		wayne.save()

		response1 = self.client.post(self.login_url, {
			"email": "wayne@smith.io", "password": "Response12345" }, format="json")

		response2 = self.client.login(email=wayne.email, password="Response12345")

		self.assertEqual(response1.status_code, 400)
		self.assertFalse(response2)


""" User Data Tests"""
class UserDataTests(TestSetUp):
	""" Test the functionality of the User Data API """

	def test_get_user_data_without_authentication(self):
		response = self.client.get(self.user_data_url)
		self.assertEqual(response.status_code, 401)

	def test_get_user_data_with_authentication(self):
		user = User.objects.create(email="bar@bie.com")
		user.set_password("Same0000")
		user.save()

		self.client.post(self.login_url, {
			"email": "bar@bie.com","password": "Same0000"
		})

		response = self.client.get(self.user_data_url)
		self.assertEqual(response.status_code, 200)


""" Profile Tests """
class ProfileTests(TestSetUp):
	def test_get_profile_by_unauthenticated_user(self):
		response = self.client.get(self.profile_url)
		self.assertEqual(response.status_code, 401)

	def test_get_profile_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.user.email, "password": "Passing1234"})
		response = self.client.get(self.profile_url)
		self.assertEqual(response.status_code, 200)

	def test_update_profile_by_unauthenticated_user(self):
		response = self.client.put(self.profile_url)
		self.assertEqual(response.status_code, 401)

	def test_update_profile_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.user.email, "password": "Passing1234"})
		response = self.client.put(self.profile_url, {
			"user": {
				"first_name": "tester",
				"last_name": "test"
			},
			"gender": "F",
			"date_of_birth": "2001-03-14",
			"phone": "+123 456 7890",
			"address": "This is Tester's home address",
			"state": "Los Angeles",
			"city": "New York",
		}, format="json")

		user = User.objects.get(email=self.user.email)
		profile = user.profile

		self.assertEqual(response.status_code, 200)
		self.assertEqual(user.first_name, "tester")
		self.assertEqual(user.last_name, "test")
		self.assertEqual(profile.gender, "F")
		self.assertEqual(profile.city, "New York")
		self.assertEqual(profile.state, "Los Angeles")
		self.assertEqual(profile.address, "This is Tester's home address")
		self.assertEqual(profile.phone, "+123 456 7890")
		self.assertEqual(profile.date_of_birth, datetime.date(2001, 3, 14))


""" Password Reset Tests"""
# class PasswordReset(TestSetUp):
	
# 	def test_reset_password(self):
# 		response = self.client.post(self.reset_password_url, {
# 			"email": "Jon@Wayne.com",
# 		})

# 		self.assertEqual(response.status_code, 200)


""" Password Change Tests """
class PasswordChangeTest(TestSetUp):
	
	def test_change_password_by_unauthenticated_user(self):
		""" Test to check if the user is not authenticated """

		user = User.objects.create(email="myman@example.com")
		user.set_password('Passing1234')
		user.save()

		response = self.client.post(self.change_password_url, {
			"new_password1": "Password1234",
			"new_password2": "Password1234"
		})

		self.assertEqual(response.status_code, 401)

	def test_change_password_by_authenticated_user(self):
		""" Test to change password for an authenticated user """

		user = User.objects.create(email="mrman2@example.com")
		user.set_password('Passing1234')
		user.save()

		response1 = self.client.post(self.login_url, {
			"email": user.email, "password": "Passing1234"
		})

		response = self.client.post(self.change_password_url, {
			"new_password1": "PassTheGameHere1234",
			"new_password2": "PassTheGameHere1234"
		})

		mrman = User.objects.get(email="mrman2@example.com")

		self.assertEqual(response.status_code, 200)
		self.assertTrue(mrman.check_password("PassTheGameHere1234"))

		