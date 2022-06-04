from collections import OrderedDict
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework.serializers import CharField, RelatedField
from .utils import get_user_info


class CustomChoiceField(CharField):
	def __init__(self, get_function, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.get_function = get_function

	def to_representation(self, value):
		return {
			"name": self.get_function(value),
			"value": value
		}


class CustomRelatedField(RelatedField):
	default_error_messages = {
        'required': _('This field is required.'),
        'does_not_exist': _('Invalid id "{pk_value}" - object does not exist.'),
        'incorrect_type': _('Incorrect type. Expected a string, received {data_type}.'),
    }

	def get_choices(self, cutoff=None):
		queryset = self.get_queryset()
		if queryset is None:
			return {}

		if cutoff is not None:
			queryset = queryset[:cutoff]

		return OrderedDict([
			(
				self.custom_to_representation(item),
				self.display_value(item)
			)
			for item in queryset
		])

	def to_internal_value(self, data):
		queryset = self.get_queryset()
		try:
			if isinstance(data, bool):
				raise TypeError
			return queryset.get(id=data)
		except ObjectDoesNotExist:
			self.fail('does_not_exist', pk_value=data)
		except (TypeError, ValueError):
			self.fail('incorrect_type', data_type=type(data).__name__)

	def custom_to_representation(self, value):
		return value.id


class ClientRelatedField(CustomRelatedField):
	def to_representation(self, value):
		data = {
			"id": value.id,
			"position": value.position,
			"company": value.company,
			"contact": get_user_info(value.contact, self.context.get("request"))
		}
		return data


class EmployeeRelatedField(CustomRelatedField):
	def to_representation(self, value):
		data = get_user_info(value.user, self.context.get("request"))
		return data



