from django.contrib.auth import get_user_model
from rest_framework.serializers import CharField, PrimaryKeyRelatedField

from .utils import get_instance, get_user_info


User = get_user_model()


class CustomChoiceField(CharField):
	def __init__(self, get_function, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.get_function = get_function

	def to_representation(self, value):
		return {
			"name": self.get_function(value),
			"value": value
		}

