from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


anonymous = AnonymousUser


class CookieAuthentication(JWTAuthentication, SessionAuthentication):
	def authenticate(self, request):
		header = self.get_header(request)

		if header is None:
			raw_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE, None)
		else:
			raw_token = self.get_raw_token(header)

		access_token = None
		refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE, None)		
		validated_token = None
		remove_token = False

		if raw_token is not None:
			try:
				validated_token = self.get_validated_token(raw_token)
			except:
				validated_token = None

		if validated_token is None and refresh_token is None:
			return anonymous

		if refresh_token is not None and validated_token is None:
			data = {}
			try:
				refresh = RefreshToken(refresh_token)

				data = {"access": str(refresh.access_token)}

				if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', None):
					if settings.SIMPLE_JWT.get('BLACKLIST_AFTER_ROTATION', None):
						try:
							# Attempt to blacklist the given refresh token
							refresh.blacklist()
						except AttributeError:
							# If blacklist app not installed, `blacklist` method will
							# not be present
							pass

					refresh.set_jti()
					refresh.set_exp()
					refresh.set_iat()

					data["refresh"] = str(refresh)
			except Exception as e:
				remove_token = True

			new_access = data.get('access', None)
			new_refresh = data.get('refresh', None)

			if new_access is None or new_refresh is None:
				return anonymous, {'remove_token', remove_token}
			else:
				access_token = new_access
				refresh_token = new_refresh
				validated_token = self.get_validated_token(access_token)

		if validated_token is None:
			return anonymous, {'remove_token', remove_token}

		user = self.get_user(validated_token)

		if not user or not user.is_active:
			return anonymous, {'remove_token', remove_token}

		self.enforce_csrf(request)

		return user, {
			'access_token': access_token, 
			'refresh_token': refresh_token,
			'remove_token': remove_token
		}

