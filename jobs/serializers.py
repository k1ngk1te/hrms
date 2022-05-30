from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from common.utils import get_instance, get_request_method
from .models import Job


class JobSerializer(serializers.ModelSerializer):
	id = serializers.CharField(required=False)
	name = serializers.CharField(required=False)

	class Meta:
		model = Job
		fields = ('name', 'id')

	def create(self, validated_data):
		name = self.validate_name(validated_data.get("name"))
		return Job.objects.create(name=name)

	def update(self, instance, validated_data):
		name = validated_data.get("name", None)
		if name is not None and name != instance.name:
			_name = get_instance(Job, {"name": name})
			if _name is not None:
				raise ValidationError("job with specified name already exists!")
			instance.name = name
			instance.save()
		return instance

	def validate_name(self, value):
		if value is None or value == '':
			raise ValidationError("name is required!")
		method = get_request_method(self.context)
		if method != "PUT" or method != "PATCH":
			name = get_instance(Job, {"name": value})
			if name is not None:
				raise ValidationError("job with specified name already exists!")
		return value
