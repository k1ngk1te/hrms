from django.db.models import Q
from rest_framework import generics

from core.views import ListCreateView
from employees.permissions import IsHROrMD, IsHROrMDOrAdminUser
from .models import Job
from .serializers import JobSerializer


class JobListView(ListCreateView):
	queryset = Job.objects.all().order_by('-id')
	serializer_class = JobSerializer
	permission_classes = (IsHROrMDOrAdminUser, )
	ordering_fields = ('name', )
	search_fields = ('name', )
	

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = JobSerializer
	permission_classes = (IsHROrMD, )
	lookup_field = 'id'

	def get_queryset(self):
		return Job.objects.exclude(Q(name='managing director') | Q(name='human resource manager'))