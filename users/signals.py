from django.contrib.auth import get_user_model
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from core.utils import generate_id
from .models import Profile

User = get_user_model()

@receiver(pre_save, sender=Profile)
def set_profile_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("ple", key="profile_id", model=Profile)

@receiver(pre_save, sender=User)
def set_user_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("usr", key="user_id", model=User)

@receiver(post_save, sender=User)
def set_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.get_or_create(user=instance)
	elif not instance.profile:
		Profile.objects.get_or_create(user=instance)
