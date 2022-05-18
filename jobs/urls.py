from django.urls import path

from .views import JobListView, JobDetailView

urlpatterns = [
	path('api/jobs/', JobListView.as_view(), name="jobs"),
	path('api/jobs/<int:id>/', JobDetailView.as_view(), name="job-detail"),
]