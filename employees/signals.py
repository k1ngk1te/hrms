from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Department


@receiver(post_save, sender=Department)
def check_hod(sender, instance, **kwargs):
	if instance.hod is not None and (
		instance.hod.department is None or instance.hod.department != instance):
		instance.hod.department = instance
		instance.hod.save()