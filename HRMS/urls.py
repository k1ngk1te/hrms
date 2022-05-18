from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import include, path, re_path

from users.views import CustomLoginView

admin.site.site_header = "Human Resource Management Administration"
admin.site.site_title = "Human Resource Management Administration Portal"
admin.site.index_title = "Human Resource Management Administration Portal"

urlpatterns = [
    path('d-admin/', admin.site.urls),
    path('api/auth/login/', CustomLoginView.as_view(), name='rest_login'),
    path('api/auth/', include('dj_rest_auth.urls')),

    path('', include('employees.urls')),
    path('', include('jobs.urls')),
    path('', include('leaves.urls')),
    path('', include('notifications.urls')),
    path('', include('users.urls')),
    path('', TemplateView.as_view(template_name="base.html")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [re_path(r'^.*$', TemplateView.as_view(template_name="base.html")), ]