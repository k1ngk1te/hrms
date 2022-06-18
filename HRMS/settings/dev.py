import os

from HRMS.settings.base import *

ALLOWED_HOSTS = ['localhost', 'testserver']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

INTERNAL_IPS = ['127.0.0.1', 'localhost']

# Email Settings
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

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
