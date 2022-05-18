from django.contrib import admin
from .models import Department, Employee


class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('name', 'hod')


class EmployeeAdmin(admin.ModelAdmin):
	list_display = (
		'user', 'department', 'status', 'is_supervisor', 'is_hod',
		'is_hr', 'is_md')


admin.site.register(Department, DepartmentAdmin)
admin.site.register(Employee, EmployeeAdmin)