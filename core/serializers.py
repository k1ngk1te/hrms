from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.fields import empty

User = get_user_model()


class PersonSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField('get_image')
    email = serializers.SerializerMethodField('get_email')
    first_name = serializers.SerializerMethodField('get_first_name')
    last_name = serializers.SerializerMethodField('get_last_name')
    full_name = serializers.SerializerMethodField('get_full_name')
    active = serializers.SerializerMethodField('get_active')

    class Meta:
        fields = ('image', 'email', 'first_name', 'last_name',
            'full_name', 'active')

    def __init__(self, instance=None, data=empty, **kwargs):
        self.meta_model = self.Meta.model if self.Meta is not None else None
        self.relation_key = self.Meta.relation_key if self.Meta is not None else None
        assert self.meta_model is not None, (
            'Person field must provide a `model`in Meta Class, ')
        assert self.relation_key is not None, (
            'Person field must provide a `relation`in Meta Class, ')
        self.instance = instance
        if data is not empty:
            self.initial_data = data
        super().__init__(**kwargs)

    def get_user(self, pk=None):
        if pk is None:
            return None
        instance = self.meta_model.objects.get(pk=pk)
        if isinstance(instance, User):
            return instance
        user = getattr(instance, self.relation_key)
        assert isinstance(user, User), (
            'user must be of type `<class users.models.User>`, ')
        return user

    def get_image(self, obj):
        user = self.get_user(obj.pk)
        if user is None:
            return None
        request = self.context.get("request")
        try:
            if bool(user.profile.image) is True:
                if request is not None:
                    return request.build_absolute_uri(user.profile.image.url)
                return user.profile.image.url
        except:
            return None

    def get_email(self, obj):
        user = self.get_user(obj.pk)
        return user.email if user is not None else None

    def get_first_name(self, obj):
        user = self.get_user(obj.pk)
        return user.first_name if user is not None else None

    def get_last_name(self, obj):
        user = self.get_user(obj.pk)
        return user.last_name if user is not None else None

    def get_full_name(self, obj):
        user = self.get_user(obj.pk)
        return user.get_full_name() if user is not None else None

    def get_active(self, obj):
        user = self.get_user(obj.pk)
        return user.is_active if user is not None else None



# data = {
#     "image": get_profile_image(user, request),
#     "first_name": user.first_name,
#     "last_name": user.last_name,
#     "full_name": user.get_full_name(),
#     "email": user.email,
#     "active": user.is_active,
# }
#
#
# def get_profile_image(user, request=None):
# 	try:
# 		if bool(user.profile.image) is True:
# 			if request is not None:
# 				return request.build_absolute_uri(user.profile.image.url)
# 			else:
# 				return user.profile.image.url
# 		return None
# 	except:
# 		return None
#
# def get_user_info(user, request=None, check_admin=False):
# 	try:
# 		data = {
# 			"image": get_profile_image(user, request),
# 			"first_name": user.first_name,
# 			"last_name": user.last_name,
# 			"full_name": user.get_full_name(),
# 			"email": user.email,
# 			"active": user.is_active,
# 		}
#
# 		try:
# 			if user.employee:
# 				data.update({"empId": user.employee.id})
#
# 				if user.employee.job:
# 					data.update({ "job": user.employee.job.name })
#
# 			if check_admin is True:
# 				employee = user.employee
# 				if employee is None:
# 					admin_status = None
# 				elif employee.is_md is True:
# 					admin_status = "md"
# 				elif employee.is_hr is True:
# 					admin_status = "hr"
# 				elif employee.is_hod is True:
# 					admin_status = "hod"
# 				elif employee.is_supervisor is True:
# 					admin_status = "supervisor"
# 				else:
# 					admin_status = None
#
# 				data.update({
# 					"is_admin": user.is_staff,
# 					"admin_status": admin_status,
# 					"leaves_taken": employee.leaves_taken,
# 					"leaves_remaining": employee.leaves_remaining,
# 					"punched_in": bool(employee.has_punched_in),
# 					"punched_out": bool(employee.has_punched_out),
# 				})
# 		except:
# 			pass
#
# 		return data
# 	except:
# 		return None
