from django.apps import apps as django_apps
from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import Http404
from django.shortcuts import (
	get_object_or_404 as _get_object_or_404,
	get_list_or_404 as _get_list_or_404,
)

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
