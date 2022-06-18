from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.timezone import now
from .managers import UserManager

GENDER_CHOICES = (
    ('M', 'Male'),
    ('F', 'Female')
)

ID_LENGTH = settings.ID_MAX_LENGTH


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.BigAutoField(primary_key=True)
    id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    first_name = models.CharField(verbose_name='first name', max_length=150, blank=True)
    last_name = models.CharField(verbose_name='last name', max_length=150, blank=True)
    is_active = models.BooleanField(default=True, help_text=(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
            ))
    is_admin = models.BooleanField(default=False, help_text=(
            'Designates whether this user is a staff and can log into the admin site. '
            ))
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    @property
    def is_staff(self):
        if self.is_admin is True:
            return True
        try:
            user = get_user_model().objects.get(email=self.email)
            if user.employee:
                employee = user.employee
                if (employee.is_md is True) or (employee.is_hr is True) or (
                    employee.is_hod is True) or (employee.is_supervisor is True):
                    return True
        except:
            pass
        return False

    @property
    def is_employee(self):
    	try:
    		user = get_user_model().objects.get(email=self.email)
    		if user.employee:
    			return True
    		return False
    	except:
    		pass
    	return False

    @property
    def is_client(self):
    	try:
    		user = get_user_model().objects.get(email=self.email)
    		if user.client:
    			return True
    		return False
    	except:
    		pass
    	return False


class Profile(models.Model):
    profile_id = models.BigAutoField(primary_key=True)
    id = models.CharField(max_length=ID_LENGTH, unique=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(upload_to="images/users/profile", default="images/users/profile/default.png")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(default=now, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} profile"
