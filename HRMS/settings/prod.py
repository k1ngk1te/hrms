import environ

from UnifoamHr.settings.base import *

env = environ.Env(
	DEBUG=(bool, False),
)

DEBUG = env('DEBUG')

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

DATABASES = {
	'default': env.db(),
}

# USE_REST_FRAMEWORK_SWAGGER = env('USE_REST_FRAMEWORK_SWAGGER')
# if USE_REST_FRAMEWORK_SWAGGER is True:
# 	INSTALLED_APPS += ['drf_yasg']

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


# Cors Header Settings
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
JWT_AUTH_SECURE = True

# Celery Settings
CELERY_BROKER_URL = env('CELERY_BROKER_URL')

# File Storage Settings
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': env('CLOUDINARY_API_KEY'),
    'API_SECRET': env('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
