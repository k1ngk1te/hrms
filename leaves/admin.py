from django.contrib import admin
from .models import Leave, Overtime


class LeaveAdmin(admin.ModelAdmin):
	list_display = ('employee', 'start_date', 'end_date', 'status')


class OvertimeAdmin(admin.ModelAdmin):
	list_display = ('employee', 'date', 'hours')


admin.site.register(Leave, LeaveAdmin)
admin.site.register(Overtime, OvertimeAdmin)
