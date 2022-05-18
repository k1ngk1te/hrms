from django.db import models
from django.urls import reverse


class Job(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.name

	def get_absolute_url(self):
		return reverse("job-detail", kwargs={"id": self.id})