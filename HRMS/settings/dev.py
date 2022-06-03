import os
import environ

from HRMS.settings.base import *
from HRMS.settings.base import INSTALLED_APPS

env = environ.Env(
    USE_REST_FRAMEWORK_SWAGGER=(bool, False)
)

ALLOWED_HOSTS = ['localhost', 'testserver']

DEBUG = True

SECRET_KEY = env('SECRET_KEY')

# USE_REST_FRAMEWORK_SWAGGER = env('USE_REST_FRAMEWORK_SWAGGER')
# if USE_REST_FRAMEWORK_SWAGGER is True:
# 	INSTALLED_APPS += ['drf_yasg']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

INTERNAL_IPS = ['127.0.0.1', 'localhost']

# Email Settings
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# CONTACT_SUPPORT_EMAIL = ""
LEAVE_EMAIL = env('LEAVE_EMAIL')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

ANYMAIL = {
    "SENDGRID_API_KEY": os.environ.get("SENDGRID_API_KEY"),
}

JWT_AUTH_SECURE = False

CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# Cors Header Settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]


# Celery Settings
CELERY_BROKER_URL = 'redis://localhost:6379'
