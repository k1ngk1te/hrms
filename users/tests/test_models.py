from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from common.utils import get_instance
from users.models import Profile

User = get_user_model()


""" User Model Tests """
class UsersManagersTests(TestCase):

	def test_create_user(self):
		user = User.objects.create_user(email='normal@user.com', password='foo')
		user2 = User.objects.create_user(email='abnOrMaL@uSeR.com', password='foo')

		profile = get_instance(Profile, {"user": user})
		profile2 = get_instance(Profile, {"user": user2})

		self.assertEqual(user.email, 'normal@user.com')
		self.assertEqual(user2.email, 'abnormal@user.com')
		self.assertTrue(user.is_active)
		self.assertTrue(user2.is_active)
		self.assertFalse(user.is_admin)
		self.assertFalse(user2.is_admin)
		self.assertFalse(user.is_staff)
		self.assertFalse(user2.is_staff)
		self.assertFalse(user.is_superuser)
		self.assertFalse(user2.is_superuser)
		self.assertIsNotNone(profile)
		self.assertIsNotNone(profile2)
		try:
			self.assertIsNotNone(user.email)
		except AttributeError:
			pass
		with self.assertRaises(TypeError):
			User.objects.create_user()
		with self.assertRaises(ValueError):
			User.objects.create_user(email='', password="foo")
		with self.assertRaises(IntegrityError):
			User.objects.create_user(email='normal@user.com', password='foo')

	def test_create_superuser(self):
		admin_user = User.objects.create_superuser('super@user.com', 'foo')
		admin_user2 = User.objects.create_superuser('suPeR2@user.com', 'foo')
		self.assertEqual(admin_user.email, 'super@user.com')
		self.assertEqual(admin_user2.email, 'super2@user.com')
		self.assertTrue(admin_user.is_active)
		self.assertTrue(admin_user2.is_active)
		self.assertTrue(admin_user.is_staff)
		self.assertTrue(admin_user2.is_staff)
		self.assertTrue(admin_user.is_superuser)
		self.assertTrue(admin_user2.is_superuser)
		try:
			self.assertIsNotNone(admin_user.email)
			self.assertIsNotNone(admin_user2.email)
		except AttributeError:
			pass
		with self.assertRaises(ValueError):
			User.objects.create_superuser(email='', password="foo")
		with self.assertRaises(IntegrityError):
			User.objects.create_superuser('super2@user.com', 'foo')
