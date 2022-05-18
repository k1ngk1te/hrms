from django.contrib import admin
from .models import Leave


class LeaveAdmin(admin.ModelAdmin):
	list_display = ('employee', 'start_date', 'end_date', 'status')


admin.site.register(Leave, LeaveAdmin)

