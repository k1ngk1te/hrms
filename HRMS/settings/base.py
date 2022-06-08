import environ
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()

SECRET_KEY = env('SECRET_KEY')

# CONTACT_SUPPORT_EMAIL = ""
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
LEAVE_EMAIL = env('LEAVE_EMAIL') if env('LEAVE_EMAIL') else DEFAULT_FROM_EMAIL
OVERTIME_EMAIL = env('OVERTIME_EMAIL') if env('OVERTIME_EMAIL') else DEFAULT_FROM_EMAIL

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ID_MAX_LENGTH = 7
ID_Z_FILL = 4

ATTENDANCE_ID_MAX_LENGTH = 20
LEAVE_ID_MAX_LENGTH = 10

# Custom User Settings
AUTH_USER_MODEL = 'users.User'

# Django All-Auth Settings
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False


SITE_ID = 1


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'core.apps.CoreConfig',
    'employees.apps.EmployeesConfig',
    'leaves.apps.LeavesConfig',
    'jobs.apps.JobsConfig',
    'notifications.apps.NotificationsConfig',
    'users.apps.UsersConfig',

    'allauth',
    'allauth.account',
    'anymail',
    'cloudinary',
    'corsheaders',
    'django_filters',
    'dj_rest_auth',
    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'HRMS.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'HRMS.wsgi.application'


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Lagos'

USE_I18N = True

USE_L10N = True

"""
When USE_TZ is False, this is the time zone in which Django will store all datetimes. 
When USE_TZ is True, this is the default time zone that Django will use to display 
datetimes in templates and to interpret datetimes entered in forms.
"""
USE_TZ = False


# Vite App Dir: point it to the folder your vite app is in.
VITE_APP_DIR = BASE_DIR / "src"

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    VITE_APP_DIR / "dist",
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media files (videos)

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'users.serializers.UserDetailSerializer',
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        'core.authentication.CustomSessionAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    "DEFAULT_PAGINATION_CLASS": 'rest_framework.pagination.LimitOffsetPagination',
    "DEFAULT_PERMISSION_CLASSES": (
        'users.permissions.IsAuthenticated',
    ),
    "DEFAULT_SCHEMA_CLASS": 'rest_framework.schemas.coreapi.AutoSchema',
    "NON_FIELD_ERRORS_KEY": 'error',
    "PAGE_SIZE": 50
}


# CSRF
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'

# Session
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# Restframework Settings
REST_USE_JWT = False
REST_AUTH_TOKEN_MODEL = None
REST_SESSION_LOGIN = True


# JWT_AUTH_COOKIE = 'access_custom_token'
# JWT_AUTH_REFRESH_COOKIE = 'refresh_custom_token'
# JWT_AUTH_HTTPONLY = True
# JWT_AUTH_SAMESITE = 'Lax'
# JWT_AUTH_COOKIE_USE_CSRF = True
# JWT_AUTH_COOKIE_ENFORCE_CSRF_ON_UNAUTHENTICATED = True

# SIMPLE JWT Settings
# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
#     'AUTH_HEADER_TYPES': ('Bearer', ),
#     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken', ),
#     'BLACKLIST_AFTER_ROTATION': True,
#     'REFRESH_TOKEN_LIFETIME': timedelta(hours=6),
#     'ROTATE_REFRESH_TOKENS': True,
# }
