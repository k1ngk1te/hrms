from django.conf import settings
from django.db import models
from django.urls import reverse

ID_LENGTH = settings.ID_MAX_LENGTH

class Job(models.Model):
	job_id = models.BigAutoField(primary_key=True)
	id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.name

	def get_absolute_url(self):
		return reverse("job-detail", kwargs={"id": self.id})
