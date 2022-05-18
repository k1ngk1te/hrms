import environ
import os

from django.core.asgi import get_asgi_application
from pathlib from Path


BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

environment = env('ENV')


if environment is not None and environment == "development":
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HRMS.settings.dev')
else:
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HRMS.settings.prod')


application = get_asgi_application()
