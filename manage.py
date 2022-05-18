#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import environ
import os
import sys

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

env = environ.Env()

environment = env('ENV')


def main():
    """Run administrative tasks."""
    if environment is not None and environment == "development":
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HRMS.settings.dev')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HRMS.settings.prod')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
