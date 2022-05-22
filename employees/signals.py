from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from rest_framework.exceptions import ValidationError

from .models import Attendance, Department


@receiver(pre_save, sender=Attendance)
def check_attendance(sender, instance, **kwargs):
	if instance.punch_out and instance.punch_in > instance.punch_out:
		raise ValidationError({"punch_out": "Invalid Time. Punch in time is greater than punch out time."})


@receiver(post_save, sender=Department)
def check_hod(sender, instance, **kwargs):
	if instance.hod is not None and (
		instance.hod.department is None or instance.hod.department != instance):
		instance.hod.department = instance
		instance.hod.save()

