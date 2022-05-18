from django.contrib import admin
from .models import Notification


class NotificationAdmin(admin.ModelAdmin):
	list_display = ('_type', 'sender', 'recipient', 'read', 'message', 'date_sent')
	list_filter = ('_type', 'sender', 'recipient', 'read', 'date_sent')


admin.site.register(Notification, NotificationAdmin)