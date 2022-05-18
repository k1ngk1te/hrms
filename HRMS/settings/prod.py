import environ

from UnifoamHr.settings.base import *

env = environ.Env(
	DEBUG=(bool, False),
	CORS_ALLOW_CREDENTIALS=(bool, True)
)

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

SECRET_KEY = env('SECRET_KEY')

DATABASES = {
	'default': env.db(),
}

DEBUG = env('DEBUG')

# Heroku
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True


# Email Settings
EMAIL_BACKEND = "anymail.backends.sendgrid.EmailBackend"
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_PORT = 587
ANYMAIL = {
    "SENDGRID_API_KEY": env('SENDGRID_API_KEY'),
}

# CONTACT_SUPPORT_EMAIL = ""
default_email = env('DEFAULT_FROM_EMAIL')
leave_email = env('LEAVE_EMAIL')

if default_email is not None:
	DEFAULT_FROM_EMAIL = default_email
else:
	DEFAULT_FROM_EMAIL = 'kitewebdevelopers@gmail.com'

if leave_email is not None:
	LEAVE_EMAIL = leave_email
else:
	LEAVE_EMAIL = DEFAULT_FROM_EMAIL
	

# Cors Header Settings
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
JWT_AUTH_SECURE = True
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')

# Celery Settings
CELERY_BROKER_URL = env('CELERY_BROKER_URL')

# File Storage Settings
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': env('CLOUDINARY_API_KEY'),
    'API_SECRET': env('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

