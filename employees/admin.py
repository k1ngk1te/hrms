from django.contrib import admin
from .models import Attendance, Client, Department, Employee


class AttendanceAdmin(admin.ModelAdmin):
	list_display = ('employee', 'date', 'punch_in', 'punch_out')


class ClientAdmin(admin.ModelAdmin):
	list_display = ('company', 'contact', )


class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('name', 'hod')


class EmployeeAdmin(admin.ModelAdmin):
	list_display = (
		'user', 'department', 'status', 'is_supervisor', 'is_hod',
		'is_hr', 'is_md')


admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Employee, EmployeeAdmin)