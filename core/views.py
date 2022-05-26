from rest_framework import mixins
from rest_framework.exceptions import server_error, MethodNotAllowed
from rest_framework.generics import GenericAPIView


class ListCreateUpdateView(mixins.ListModelMixin,
											mixins.CreateModelMixin,
											mixins.UpdateModelMixin,
											GenericAPIView):

	def get(self, request, *args, **kwargs):
		return self.list(request, *args, **kwargs)
	
	def post(self, request, *args, **kwargs):
		return self.custom_create(request, *args, **kwargs)

	def put(self, request, *args, **kwargs):
		return self.custom_update(request, *args, **kwargs)

	def custom_create(self, request, *args, **kwargs):
		if self.validate_lookup_field(kwargs.get(self.lookup_field, None), False) is True:
			return self.create(request, *args, **kwargs)
		return server_error(request, *args, **kwargs)

	def custom_update(self, request, *args, **kwargs):
		if self.validate_lookup_field(kwargs.get(self.lookup_field, None), True) is True:
			return self.update(request, *args, **kwargs)
		return server_error(request, *args, **kwargs)

	def validate_lookup_field(self, lookup_field, id_required=True):
		if id_required:
			if lookup_field is not None:
				return True
			raise MethodNotAllowed(self.request.method)
		else:
			if lookup_field is None:
				return True
			raise MethodNotAllowed(self.request.method)


class ListCreateRetrieveUpdateView(mixins.RetrieveModelMixin, 
													   ListCreateUpdateView):

	def get(self, request, *args,  **kwargs):
		if self.lookup_field and kwargs.get(self.lookup_field, None) is not None:
			return self.retrieve(request, *args, **kwargs)
		return self.list(request, *args, **kwargs)


class ListCreateRetrieveUpdateDestroyView(ListCreateRetrieveUpdateView,
														mixins.DestroyModelMixin):

	def delete(self, request, *args,  **kwargs):
		if self.validate_lookup_field(kwargs.get(self.lookup_field, None), True) is True:
			return self.destroy(request, *args, **kwargs)
		return server_error(request, *args, **kwargs)
