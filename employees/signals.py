from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from rest_framework.exceptions import ValidationError

from common.utils import get_instance
from core.utils import generate_id
from .models import Attendance, Client, Department, Employee, Holiday, Project, Task


@receiver(pre_save, sender=Attendance)
def check_attendance(sender, instance, **kwargs):
	if instance.punch_out and instance.punch_in > instance.punch_out:
		raise ValidationError({"punch_out": "Invalid Time. Punch in time is greater than punch out time."})
	if not instance.id:
		instance.id = generate_id("atd", key="attendance_id", model=Attendance)

@receiver(pre_save, sender=Client)
def set_client_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("cli", key="client_id", model=Client)

@receiver(pre_save, sender=Department)
def set_department_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("dep", key="department_id", model=Department)

@receiver(post_save, sender=Department)
def set_hod(sender, instance, **kwargs):
	try:
		if instance.hod and instance.hod.department != instance:
			instance.hod.department = instance
			instance.hod.save()
	except:
		pass

@receiver(pre_save, sender=Employee)
def set_employee_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("emp", key="employee_id", model=Employee)

@receiver(pre_save, sender=Holiday)
def set_holiday_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("hol", key="holiday_id", model=Holiday)

@receiver(pre_save, sender=Project)
def set_project_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("prj", key="project_id", model=Project)

@receiver(pre_save, sender=Task)
def set_task_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("tsk", key="task_id", model=Task)
