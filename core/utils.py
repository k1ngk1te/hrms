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
