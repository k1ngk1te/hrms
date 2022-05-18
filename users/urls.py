from django.urls import path
from .views import ProfileView


urlpatterns = [
	path('api/profile/', ProfileView.as_view(), name='profile'),
]