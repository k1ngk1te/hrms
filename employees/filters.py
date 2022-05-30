from django_filters import rest_framework as filters

from .models import Client

class ClientFilter(filters.FilterSet):
	active = filters.BooleanFilter(field_name='contact__is_active')

	class Meta:
		model = Client
		fields = ('active', )
