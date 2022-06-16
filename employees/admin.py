from django.contrib import admin
from .models import Attendance, Client, Department, Employee, Project, Task


class TaskInline(admin.StackedInline):
	model = Task
	min_num = 0
	max_num = 0


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


class ProjectAdmin(admin.ModelAdmin):
	list_display = ('name', 'start_date', 'end_date', 'completed')
	inlines = (TaskInline, )


class TaskAdmin(admin.ModelAdmin):
	list_display = ('name', 'create_date', 'due_date', 'completed', 'verified')


admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)