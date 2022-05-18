import os

from HRMS.settings.base import *
from HRMS.settings.base import INSTALLED_APPS

ALLOWED_HOSTS = ['localhost', 'testserver']

DEBUG = True

SECRET_KEY = 'hi@potez^(d0)vzu)*71kl-^t^$d6+_6sylm^alp(vf!%cvw!m'

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
LEAVE_EMAIL = "kitewebdevelopers@gmail.com"
DEFAULT_FROM_EMAIL = "kitewebdevelopers@gmail.com"

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

