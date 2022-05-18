from django.contrib import admin
from .models import Job


class JobAdmin(admin.ModelAdmin):
	list_display = ('name',)


admin.site.register(Job, JobAdmin)