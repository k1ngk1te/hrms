from django.contrib import admin
from .models import Client, Department, Employee


class ClientAdmin(admin.ModelAdmin):
	list_display = ('company', 'contact', )


class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('name', 'hod')


class EmployeeAdmin(admin.ModelAdmin):
	list_display = (
		'user', 'department', 'status', 'is_supervisor', 'is_hod',
		'is_hr', 'is_md')


admin.site.register(Client, ClientAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Employee, EmployeeAdmin)