from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers

from common.serializer_fields import CustomChoiceField
from common.utils import get_request_method, get_instance, get_user_info
from .models import Profile


User = get_user_model()


def get_gender_name(gender):
	if gender == "M":
		return "male"
	else:
		return "female"

def get_marital_status(status):
	if status == "D":
		return "divorced"
	elif status == "M":
		return "married"
	else:
		return "single"


class JWTSerializer(serializers.Serializer):
	access_token = serializers.CharField()
	refresh_token = serializers.CharField()
	user = serializers.SerializerMethodField()

	def get_user(self, obj):
		user = obj['user'];
		request = self.context.get('request');
		user_data = get_user_info(user, request, True);

		return user_data


class ProfileSerializer(serializers.ModelSerializer):
	image_url = serializers.SerializerMethodField('get_image_url')
	date = serializers.SerializerMethodField('get_date')
	gender = CustomChoiceField(get_gender_name)
	marital_status = CustomChoiceField(get_marital_status, required=False)
	last_leave_info = serializers.SerializerMethodField('get_last_leave_info')

	class Meta:
		model = Profile
		fields = (
			'image', 'image_url', 'gender', 'address', 'marital_status', 'last_leave_info',
			'date_of_birth', 'phone', 'state', 'city', 'date'
		)

	def get_image_url(self, obj):
		if obj.image._file is None:
			return None
		request = self.context.get('request')
		if obj.image:
			if request:
				return request.build_absolute_uri(obj.image.url)
			return obj.image.url
		return None

	def get_date(self, obj):
		return obj.date_updated

	def get_last_leave_info(self, obj):
		try:
			leave = obj.user.employee.leaves.last()
			data = {
				"completed": leave.completed,
				"no_of_days": leave.no_of_days,
				"start_date": leave.start_date,
				"end_date": leave.end_date
			}
			return data
		except:
			return None


class UserDetailSerializer(UserDetailsSerializer):
	data = serializers.SerializerMethodField('get_user_data')

	class Meta(UserDetailsSerializer.Meta):
		fields = ('data', )

	def get_user_data(self, obj):
		request = self.context.get('request')
		return get_user_info(obj, request, True)


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('email', 'first_name', 'last_name')
		extra_kwargs = {
			'email': {
				'validators': []
			}
		}

	def create(self, validated_data):
		email = validated_data.pop("email")
		if get_instance(User, {"email": email}) is not None:
			raise ValidationError({
				"email": "User with specified email already exists!"
			})
		user = User.objects.create(email=email, **validated_data)
		user.set_password(validated_data.get("last_name").upper())
		user.save()
		return user

	def validate_email(self, value):
		try:
			validate_email(value)
		except ValidationError:
			raise ValidationError({
				"email": "Enter a valid e-mail address"
			})
		email = value.lower()
		method = get_request_method(self.context)
		if method != 'PUT' and method != 'PATCH':
			_user = get_instance(User, {"email": email})
			if _user is not None:
				raise ValidationError("user with this email address already exists.")
		return email


class UserUpdateSerializer(serializers.Serializer):
	first_name = serializers.CharField()
	last_name= serializers.CharField()


class ProfileUpdateSerializer(serializers.ModelSerializer):
	user = UserUpdateSerializer()
	image_url = serializers.SerializerMethodField('get_image_url')

	class Meta:
		model = Profile
		fields = ("user", "image", "image_url", "gender", "address", "date_of_birth", 
			"marital_status", "phone", "state", "city")

	def update(self, instance, validated_data):
		user = validated_data.pop("user")
		instance.user.first_name = user.get("first_name", instance.user.first_name)
		instance.user.last_name = user.get("last_name", instance.user.last_name)
		instance.user.save()

		instance.image = validated_data.get("image", instance.image)
		instance.gender = validated_data.get("gender", instance.gender)
		instance.address = validated_data.get("address", instance.address)
		instance.date_of_birth = validated_data.get("date_of_birth", instance.date_of_birth)
		instance.marital_status = validated_data.get("marital_status", instance.marital_status)
		instance.phone = validated_data.get("phone", instance.phone)
		instance.state = validated_data.get("state", instance.state)
		instance.city = validated_data.get("city", instance.city)
		instance.save()
		return instance

	def get_image_url(self, obj):
		request = self.context.get("request")
		if obj.image.url and request:
			return request.build_absolute_uri(obj.image.url)
		return None


