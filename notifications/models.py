from django.conf import settings
from django.db import models
from django.urls import reverse
from employees.models import Employee


NOTIFICATION_CHOICES = (
	('L', 'Leave'),
	('O', 'Overtime')
)

ID_LENGTH = settings.LEAVE_ID_MAX_LENGTH

class Notification(models.Model):
	_type = models.CharField(max_length=1, choices=NOTIFICATION_CHOICES)
	sender = models.ForeignKey(Employee, on_delete=models.SET_NULL, related_name="sender", null=True)
	recipient = models.ForeignKey(Employee, on_delete=models.SET_NULL, related_name="recipient", null=True)
	message = models.TextField()
	message_id = models.CharField(max_length=ID_LENGTH)
	read = models.BooleanField(default=False)
	date_sent = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return "from %s to %s" % (self.sender.user.email, self.recipient.user.email)

	def get_absolute_url(self):
		return reverse('notification-detail', kwargs={"id": self.id})