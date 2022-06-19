import environ
import os

from celery import Celery
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

DEBUG = env('DEBUG')

# Set the default Django settings module for the 'celery' program.
if DEBUG:
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HRMS.settings.dev')
else:
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HRMS.settings.prod')


app = Celery('HRMS')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')