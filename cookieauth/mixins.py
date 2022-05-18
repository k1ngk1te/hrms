from dj_rest_auth.jwt_auth import set_jwt_cookies, unset_jwt_cookies
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.settings import api_settings


class BaseModelMixin:
	def __init__(self, *args, **kwargs):
		self.response = Response()
		
	def set_auth_cookies(self, request):
		if request.auth:
			prev_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE, None)
			access_token = request.auth.get('access_token', None)
			refresh_token = request.auth.get('refresh_token', None)
			remove_token = request.auth.get('remove_token', False)
			print("REMOVE_TOKEN :>> ", remove_token)
			if remove_token:
				unset_jwt_cookies(self.response)
			print("\nPrev Token :>> ", prev_token)
			print("\nAccess Token :>> ", access_token)
			if access_token and refresh_token:
				prev_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE, None)
				if prev_token is None:
					unset_jwt_cookies(self.response)
					set_jwt_cookies(self.response, access_token, refresh_token)
		return None
		

class CreateModelMixin(BaseModelMixin):
	def create(self, request, *args, **kwargs):
		
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		self.response.data = serializer.data
		self.response.status = status.HTTP_201_CREATED
		self.response.headers = headers
		return self.response

	def perform_create(self, serializer):
		serializer.save()

	def get_success_headers(self, data):
		try:
			return {'Location': str(data[api_settings.URL_FIELD_NAME])}
		except (TypeError, KeyError):
			return {}


class ListModelMixin(BaseModelMixin):
	def list(self, request, *args, **kwargs):
		self.set_auth_cookies(request)
		queryset = self.filter_queryset(self.get_queryset())

		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)

		serializer = self.get_serializer(queryset, many=True)
		self.response.data = serializer.data
		return self.response


class RetrieveModelMixin(BaseModelMixin):
	def retrieve(self, request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		self.response.data = serializer.data
		return self.response


class UpdateModelMixin(BaseModelMixin):
	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)

		if getattr(instance, '_prefetched_objects_cache', None):
			instance._prefetched_objects_cache = {}
		self.response.data = serializer.data
		return self.response

	def perform_update(self, serializer):
		serializer.save()

	def partial_update(self, request, *args, **kwargs):
		kwargs['partial'] = True
		return self.update(request, *args, **kwargs)


class DestroyModelMixin(BaseModelMixin):
	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.perform_destroy(instance)
		self.response.status = status.HTTP_204_NO_CONTENT
		return self.response

	def perform_destroy(self, instance):
		instance.delete()
