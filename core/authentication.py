from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError


class CustomSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        user = getattr(request._request, 'user', None)

        if not user or not user.is_active:
            return None

        self.enforce_csrf(request)
        return (user, None)

    def authenticate_header(self, request):
        return 'Session'