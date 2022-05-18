from django.contrib.auth import get_user_model
from notifications.models import Notification

from .test_setup import TestSetUp


User = get_user_model()


""" Notification Model Tests """
class NotificationTests(TestSetUp):
	def test_create_notification(self):
		notification = Notification.objects.create(
			_type="L", sender=self.employee2, recipient=self.employee,
			message="This is test message", message_id=1)

		self.assertEqual(notification.sender, self.employee2)
		self.assertEqual(notification.recipient, self.employee)
		self.assertEqual(notification._type, "L")
		self.assertFalse(notification.read)