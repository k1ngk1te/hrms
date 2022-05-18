from notifications.models import Notification
from .test_setup import TestSetUp


""" Notification List View Tests """
class NotificationListViewTests(TestSetUp):
	def test_get_notifications_by_unauthenticated_user(self):
		response = self.client.get(self.notifications_url)
		self.assertEqual(response.status_code, 401)

	def test_get_notifications_by_authenticated_user(self):
		self.client.post(self.login_url, {
			"email": self.employee.user.email, "password": "Passing1234"})
		response1 = self.client.get(self.notifications_url)

		for i in range(60):
			Notification.objects.create(
			_type="L", sender=self.employee2, recipient=self.employee,
			message=f"This is test message {i}", message_id=i)

		response2 = self.client.get(self.notifications_url)
		notes = Notification.objects.filter(recipient=self.employee)

		self.assertEqual(response1.status_code, 200)
		self.assertEqual(response2.status_code, 200)
		self.assertEqual(len(response2.data['results']), 50)



