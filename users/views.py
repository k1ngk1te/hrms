from dj_rest_auth.views import LoginView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import get_instance
from employees.models import Employee
from employees.serializers import EmployeeSerializer
from .serializers import ProfileUpdateSerializer, UserDetailSerializer


User = get_user_model()


class ProfileView(APIView):
	def get(self, request, *args, **kwargs):
		employee = get_instance(Employee, {"user": request.user})
		if employee is None:
			return Response("Employee Does Not Exist", status=status.HTTP_404_NOT_FOUND)
		serializer = EmployeeSerializer(employee, context={"request": request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	def put(self, request, *args, **kwargs):
		serializer = ProfileUpdateSerializer(request.user.profile, 
			data=request.data, context={"request": request})
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)	
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(LoginView):
	def get_response(self):
		serializer = UserDetailSerializer(
			instance=self.user,
			context=self.get_serializer_context(),
		)
		return Response(serializer.data, status=status.HTTP_200_OK)

