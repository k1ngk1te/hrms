import datetime
from collections import OrderedDict
from django.apps import apps as django_apps
from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import Http404
from django.shortcuts import (
	get_object_or_404 as _get_object_or_404,
	get_list_or_404 as _get_list_or_404,
)
from django.utils.timezone import now


weekdays = OrderedDict({
	"mon": OrderedDict({
		"index": 0,
		"name": "Monday", 
	}),
	"tue": OrderedDict({
		"index": 1,
		"name": "Tuesday", 
	}),
	"wed": OrderedDict({
		"index": 2,
		"name": "Wednesday",
	}),
	"thu": OrderedDict({
		"index": 3,
		"name": "Thursday", 
	}),
	"fri": OrderedDict({
		"index": 4,
		"name": "Friday", 
	}),
	"sat": OrderedDict({
		"index": 5,
		"name": "Saturday",
	}),
	"sun": OrderedDict({
		"index": 6,
		"name": "Sunday",
	})
})


def get_object_or_404(queryset, *filter_args, **filter_kwargs):
    try:
        return _get_object_or_404(queryset, *filter_args, **filter_kwargs)
    except (TypeError, ValueError, ValidationError):
        raise Http404

def get_list_or_404(queryset, *filter_args, **filter_kwargs):
    try:
        return _get_list_or_404(queryset, *filter_args, **filter_kwargs)
    except (TypeError, ValueError, ValidationError):
        raise Http404

def get_app_model(name):
    try:
        return django_apps.get_model(name, require_ready=False)
    except ValueError:
        raise ImproperlyConfigured(
            f"{name.upper()} must be of the form 'app_label.model_name'"
        )
    except LookupError:
        raise ImproperlyConfigured(
            f"{name.upper()} refers to a model '%s' that has not been installed"
        )

def generate_id_value(prefix, id):
	id_length = len(str(id))
	Z_FILL = id_length if id_length > settings.ID_Z_FILL else settings.ID_Z_FILL
	return f"{prefix}{str(id).zfill(Z_FILL)}"

def generate_id(prefix=None, **kwargs):
	assert prefix is not None and isinstance(prefix, str), (
		'prefix must be a valid string'
	)

	id = kwargs.get("id", None)
	if id is not None:
		return generate_id_value(prefix, id)

	key = kwargs.get("key", None)
	assert key is not None, ('Provide a key along with an instance or a model')

	instance = kwargs.get("instance", None)
	instance_with_key = getattr(instance, key, None)
	if instance is not None and instance_with_key is not None:
		return generate_id_value(prefix, instance_with_key)

	Model = kwargs.get("model", None)

	if Model is not None:
		last_object = Model.objects.last()
		id = getattr(last_object, key) + 1 if last_object is not None else 1
		return generate_id_value(prefix, id)
	raise LookupError("Provide an id value as number or a key with a Model Class or an instance")

# A Function to return last day of week(sunday) depending on the datetime instance passed
def get_last_date_of_week(date=now().date()):
	current_day = weekdays.get(date.strftime('%a').lower())
	day_index = current_day.get("index")

	return date + datetime.timedelta(days=6-day_index)

# A Function to return last day of month depending on the datetime instance passed
def get_last_date_of_month(date=now().date()):
	month = 1 if date.month >= 12 else date.month + 1
	return datetime.date(date.year, month, 1) - datetime.timedelta(days=1)

def get_default_hours():
	return OrderedDict({
		"mon": None,
		"tue": None,
		"wed": None,
		"thu": None,
		"fri": None,
	})
