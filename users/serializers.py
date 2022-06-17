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


class ProfileSerializer(serializers.ModelSerializer):
	date = serializers.SerializerMethodField('get_date')
	gender = CustomChoiceField(get_gender_name)
	last_leave_info = serializers.SerializerMethodField('get_last_leave_info')

	class Meta:
		model = Profile
		fields = (
			'image', 'gender', 'address', 'last_leave_info',
			'date_of_birth', 'phone', 'state', 'city', 'date'
		)

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
		request = self.context.get('request', None)
		check_admin = self.context.get('check_admin', False)
		return get_user_info(obj, request, check_admin)


class UserSerializer(serializers.ModelSerializer):
	full_name = serializers.SerializerMethodField('get_full_name')
	active = serializers.SerializerMethodField('get_is_active')

	class Meta:
		model = User
		fields = ('email', 'first_name', 'last_name', 'full_name', 'active')
		extra_kwargs = {
			'email': {
				'validators': []
			}
		}

	def create(self, validated_data):
		email = validated_data.pop("email").lower()
		if get_instance(User, {"email": email}) is not None:
			raise ValidationError({
				"email": "User with specified email already exists!"
			})
		user = User.objects.create(email=email, **validated_data)
		user.set_password(validated_data.get("last_name").upper())
		user.save()
		return user

	def update(self, instance, validated_data):
		email = validated_data.pop("email", None)
		if email is not None and email.lower() != instance.email and get_instance(
			User, {"email": email}) is not None:
			raise ValidationError({
				"email": "User with specified email already exists!"
			})
		instance.email = validated_data.get("email", email)
		instance.first_name = validated_data.get("first_name", instance.first_name)
		instance.last_name = validated_data.get("last_name", instance.last_name)
		instance.save()
		return instance

	def validate_email(self, value):
		try:
			validate_email(value)
		except ValidationError:
			raise ValidationError("Enter a valid e-mail address")
		email = value.lower()
		method = get_request_method(self.context)
		if method != 'PUT' and method != 'PATCH':
			_user = get_instance(User, {"email": email})
			if _user is not None:
				raise ValidationError("user with this email address already exists.")
		return email

	def get_full_name(self, obj):
		return obj.get_full_name()

	def get_is_active(self, obj):
		return obj.is_active


class UserUpdateSerializer(serializers.Serializer):
	first_name = serializers.CharField(required=False)
	last_name= serializers.CharField(required=False)


class ProfileUpdateSerializer(serializers.ModelSerializer):
	user = UserUpdateSerializer(required=False)
	gender = CustomChoiceField(get_gender_name, required=False)

	class Meta:
		model = Profile
		fields = ("user", "image", "gender", "address", "date_of_birth", 
			"phone", "state", "city")

	def update(self, instance, validated_data):
		user = validated_data.pop("user", None)
		if user:
			instance.user.first_name = user.get("first_name", instance.user.first_name)
			instance.user.last_name = user.get("last_name", instance.user.last_name)
			instance.user.save()

		_gender = validated_data.get("gender", None)
		if _gender and _gender != "M" and _gender != "F":
			raise ValidationError({"gender": "Gender is invalid"})

		instance.image = validated_data.get("image", instance.image)
		instance.gender = validated_data.get("gender", _gender)
		instance.address = validated_data.get("address", instance.address)
		instance.date_of_birth = validated_data.get("date_of_birth", instance.date_of_birth)
		instance.phone = validated_data.get("phone", instance.phone)
		instance.state = validated_data.get("state", instance.state)
		instance.city = validated_data.get("city", instance.city)
		instance.save()
		return instance


class UserProfileSerializer(UserSerializer):
	profile = ProfileUpdateSerializer()

	class Meta:
		model = UserSerializer.Meta.model
		fields = UserSerializer.Meta.fields + ('profile', 'active')
		extra_kwargs = UserSerializer.Meta.extra_kwargs


	def create(self, validated_data):
		profile_data = validated_data.pop("profile")

		email = validated_data.get("email").lower()

		serializer = UserSerializer(data=validated_data, context=self.context)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		user = User.objects.get(email=email)
		user.set_password(validated_data.get("last_name").upper())
		user.save()

		_gender = profile_data.get("gender", None)
		if _gender and _gender != "M" and _gender != "F":
			raise ValidationError({"gender": "Gender is invalid"})

		profile = Profile.objects.get_or_create(user=user)[0]
		profile.image = profile_data.get("image", profile.image)
		profile.gender = profile_data.get("gender", _gender)
		profile.address = profile_data.get("address", profile.address)
		profile.date_of_birth = profile_data.get("date_of_birth", profile.date_of_birth)
		profile.phone = profile_data.get("phone", profile.phone)
		profile.state = profile_data.get("state", profile.state)
		profile.city = profile_data.get("city", profile.city)
		profile.save()

		return user

	def update(self, instance, validated_data):
		profile_data = validated_data.pop("profile")

		serializer = UserSerializer(data=validated_data, instance=instance, context=self.context)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		p_serializer = ProfileUpdateSerializer(data=profile_data, instance=instance.profile, context=self.context)
		p_serializer.is_valid(raise_exception=True)
		p_serializer.save()

		return instance