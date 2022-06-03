from django.db.models.signals import pre_save
from django.dispatch import receiver

from core.utils import generate_id
from .models import Job

@receiver(pre_save, sender=Job)
def set_job_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("job", key="job_id", model=Job)
