from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUserOrReadOnly(BasePermission):
    """
    The request is authenticated as an admin, or is a read-only request.
    """

    def has_permission(self, request, view):
        return bool(
            request.user.is_active and request.method in SAFE_METHODS or
            request.user.is_anonymous is False and request.user.is_staff and
            request.user.is_authenticated
        )


class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_active)