from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import include, path, re_path
from rest_framework.documentation import include_docs_urls
from rest_framework.schemas import get_schema_view
# from rest_framework_swagger.views import get_swagger_view

from users.views import CustomLoginView

admin.site.site_header = "Kite Human Resource Management Administration"
admin.site.site_title = "Kite Human Resource Management Administration Portal"
admin.site.index_title = "Kite Human Resource Management Administration Portal"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', CustomLoginView.as_view(), name='rest_login'),
    path('api/auth/', include('dj_rest_auth.urls')),

    path('', include('employees.urls')),
    path('', include('jobs.urls')),
    path('', include('leaves.urls')),
    path('', include('notifications.urls')),
    path('', include('users.urls')),
    path('', TemplateView.as_view(template_name="base.html")),

    path('docs/', include_docs_urls('Kite Human Resource Management Administration')),
    # path('docs/swagger/', get_swagger_view(
    #     title='Kite Human Resource Management Administration')
    # ),
    path('docs/openapi/', get_schema_view(
        title="Kite Human Resource Management Administration",
        description="API for all system functions",
        version="1.0.0"
    ), name='openapi-schema'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [re_path(r'^.*$', TemplateView.as_view(template_name="base.html")), ]
