from django.contrib.auth import get_user_model
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from .models import Profile

User = get_user_model()


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
	if created:
		if Profile.objects.filter(user=instance).exists():
			pass
		else:
			Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance,**kwargs):
	profile = Profile.objects.get_or_create(user=instance)
