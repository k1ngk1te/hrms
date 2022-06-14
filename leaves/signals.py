from django.conf import settings
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from django.template.loader import render_to_string

from common.utils import get_instance, get_instances, get_name_prefix, get_leave_type, get_overtime_type
from core.utils import generate_id
from employees.models import Employee
from leaves.tasks import send_email_task
from notifications.models import Notification
from .models import Leave, Overtime
from .utils import send_leave_email, send_overtime_email


@receiver(pre_save, sender=Leave)
def set_leave_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("lve", key="leave_id", model=Leave)


@receiver(pre_save, sender=Overtime)
def set_overtime_id(sender, instance, **kwargs):
	if not instance.id:
		instance.id = generate_id("ovt", key="overtime_id", model=Overtime)


@receiver(post_save, sender=Leave)
def send_leave_email_signal(sender, instance, created, **kwargs):
	try:
		if created and instance.employee.is_md is False:
			employee = instance.employee
			if instance.created_by is None or instance.employee == instance.created_by: # Created By Employee
				if employee.is_hr:
					recipient = get_instance(Employee, {"is_md": True})
				elif employee.is_hod:
					e = get_instances(Employee, {"is_hr": True})
					if e is not None:
						recipient = e.first()
					else:
						recipient = get_instance(Employee, {"is_md": True})
				elif employee.is_supervisor:
					if employee.supervisor:
						recipient = employee.supervisor
					elif employee.department and employee.department.hod:
						recipient = employee.department.hod
					else:
						e = get_instances(Employee, {"is_hr": True})
						if e is not None:
							recipient = e.first()
						else:
							recipient = get_instance(Employee, {"is_md": True})
				elif employee.supervisor:
					recipient = employee.supervisor
				elif employee.department and employee.department.hod:
					recipient = employee.department.hod
				else:
					e = get_instances(Employee, {"is_hr": True})
					if e is not None:
						recipient = e.first()
					else:
						recipient = get_instance(Employee, {"is_md": True})
				message=f"{employee.user.get_full_name().upper()} sent a request for leave"
				Notification.objects.create(_type="L", sender=employee, recipient=recipient,
					message=message, message_id=instance.id)
				context = {
					"name_prefix": get_name_prefix(recipient.user),
					"last_name": recipient.user.last_name,
					"leave_type": get_leave_type(instance.leave_type),
					"resume_date": instance.resume_date.strftime("%A, %d %B %Y"),
					"start_date": instance.start_date.strftime("%A, %d %B %Y"),
					"end_date": instance.end_date.strftime("%A, %d %B %Y"),
					"employee_name": instance.employee.user.get_full_name(),
					"reason": instance.reason
				}
				email_body = render_to_string('leaves/employee_to_admin.txt', context)
				send_email_task(message, email_body, settings.LEAVE_EMAIL, [recipient.user.email])
			else: # Created By An Admin
				recipient = get_instance(Employee, {"is_md": True})
				admin = instance.created_by
				if admin.is_md:
					return send_leave_email("A", admin, instance,instance.employee,"the Managing Director")
				elif admin.is_hr:
					recipient = get_instance(Employee, {"is_md": True})
				elif admin.is_hod:
					e = get_instances(Employee, {"is_hr": True})
					if e is not None:
						recipient = e.first()
					else:
						recipient = get_instance(Employee, {"is_md": True})
				elif admin.is_supervisor:
					if employee.department and employee.department.hod:
						recipient = employee.department.hod
					else:
						e = get_instances(Employee, {"is_hr": True})
						if e is not None:
							recipient = e.first()
						else:
							recipient = get_instance(Employee, {"is_md": True})

				if recipient:
					message=f"{admin.user.get_full_name().upper()} sent a request for leave on behalf of {employee.user.get_full_name()}"
					Notification.objects.create(_type="L", sender=admin, recipient=recipient,
						message=message, message_id=instance.id)
					context = {
						"name_prefix": get_name_prefix(recipient.user),
						"last_name": recipient.user.last_name,
						"leave_type": get_leave_type(instance.leave_type),
						"resume_date": instance.resume_date.strftime("%A, %d %B %Y"),
						"start_date": instance.start_date.strftime("%A, %d %B %Y"),
						"end_date": instance.end_date.strftime("%A, %d %B %Y"),
						"emp_prefix": get_name_prefix(instance.employee.user),
						"emp_name": instance.employee.user.get_full_name(),
						"reason": instance.reason,
						"admin_name": instance.created_by.user.get_full_name(),
						"admin_job": ""
					}
					if admin.job:
						context.update({"admin_job": instance.created_by.job.name})
					email_body = render_to_string('leaves/admin_to_admin.txt', context)
					send_email_task(message, email_body, settings.LEAVE_EMAIL, [recipient.user.email])
				message=f"{admin.user.get_full_name().upper()} sent a request for leave on your behalf"
				Notification.objects.create(_type="L", sender=admin, recipient=employee,
					message=message, message_id=instance.id)
				context = {
					"name_prefix": get_name_prefix(employee.user),
					"last_name": employee.user.last_name,
					"leave_type": get_leave_type(instance.leave_type),
					"resume_date": instance.resume_date.strftime("%A, %d %B %Y"),
					"start_date": instance.start_date.strftime("%A, %d %B %Y"),
					"end_date": instance.end_date.strftime("%A, %d %B %Y"),
					"reason": instance.reason,
					"admin_prefix": get_name_prefix(admin.user),
					"admin_name": admin.user.get_full_name(),
					"admin_job": ""
				}
				if admin.job:
					context.update({"admin_job": admin.job.name})
				email_body = render_to_string('leaves/admin_to_employee.txt', context)
				send_email_task(message, email_body, settings.LEAVE_EMAIL, [employee.user.email])
	except:
		pass


@receiver(post_save, sender=Overtime)
def send_overtime_email_signal(sender, instance, created, **kwargs):
	try:
		if created and instance.employee.is_md is False:
			employee = instance.employee
			if instance.created_by is None or instance.employee == instance.created_by: # Created By Employee
				if employee.is_hr:
					recipient = get_instance(Employee, {"is_md": True})
				elif employee.is_hod:
					e = get_instances(Employee, {"is_hr": True})
					if e is not None:
						recipient = e.first()
					else:
						recipient = get_instance(Employee, {"is_md": True})
				elif employee.is_supervisor:
					if employee.supervisor:
						recipient = employee.supervisor
					elif employee.department and employee.department.hod:
						recipient = employee.department.hod
					else:
						e = get_instances(Employee, {"is_hr": True})
						if e is not None:
							recipient = e.first()
						else:
							recipient = get_instance(Employee, {"is_md": True})
				elif employee.supervisor:
					recipient = employee.supervisor
				elif employee.department and employee.department.hod:
					recipient = employee.department.hod
				else:
					e = get_instances(Employee, {"is_hr": True})
					if e is not None:
						recipient = e.first()
					else:
						recipient = get_instance(Employee, {"is_md": True})
				message=f"{employee.user.get_full_name().upper()} sent a request for overtime."
				Notification.objects.create(_type="O", sender=employee, recipient=recipient,
					message=message, message_id=instance.id)
				context = {
					"name_prefix": get_name_prefix(recipient.user),
					"last_name": recipient.user.last_name,
					"overtime_type": get_overtime_type(instance.overtime_type),
					"date": instance.date.strftime("%A, %d %B %Y"),
					"hours": instance.hours,
					"employee_name": instance.employee.user.get_full_name(),
					"reason": instance.reason
				}
				email_body = render_to_string('overtimes/employee_to_admin.txt', context)
				send_email_task(message, email_body, settings.OVERTIME_EMAIL, [recipient.user.email])
			else: # Created By An Admin
				recipient = get_instance(Employee, {"is_md": True})
				admin = instance.created_by
				if admin.is_md:
					return send_overtime_email("A", admin, instance,instance.employee,"the Managing Director")
				elif admin.is_hr:
					recipient = get_instance(Employee, {"is_md": True})
				elif admin.is_hod:
					e = get_instances(Employee, {"is_hr": True})
					if e is not None:
						recipient = e.first()
					else:
						recipient = get_instance(Employee, {"is_md": True})
				elif admin.is_supervisor:
					if employee.department and employee.department.hod:
						recipient = employee.department.hod
					else:
						e = get_instances(Employee, {"is_hr": True})
						if e is not None:
							recipient = e.first()
						else:
							recipient = get_instance(Employee, {"is_md": True})

				if recipient:
					message=f"{admin.user.get_full_name().upper()} sent a request for overtime on behalf of {employee.user.get_full_name()}"
					Notification.objects.create(_type="O", sender=admin, recipient=recipient,
						message=message, message_id=instance.id)
					context = {
						"name_prefix": get_name_prefix(recipient.user),
						"last_name": recipient.user.last_name,
						"overtime_type": get_overtime_type(instance.overtime_type),
						"date": instance.date.strftime("%A, %d %B %Y"),
						"hours": instance.hours,
						"emp_prefix": get_name_prefix(instance.employee.user),
						"emp_name": instance.employee.user.get_full_name(),
						"reason": instance.reason,
						"admin_name": instance.created_by.user.get_full_name(),
						"admin_job": ""
					}
					if admin.job:
						context.update({"admin_job": instance.created_by.job.name})
					email_body = render_to_string('overtimes/admin_to_admin.txt', context)
					send_email_task(message, email_body, settings.OVERTIME_EMAIL, [recipient.user.email])
				message=f"{admin.user.get_full_name().upper()} sent a request for overtime on your behalf"
				Notification.objects.create(_type="O", sender=admin, recipient=employee,
					message=message, message_id=instance.id)
				context = {
					"name_prefix": get_name_prefix(employee.user),
					"last_name": employee.user.last_name,
					"overtime_type": get_overtime_type(instance.overtime_type),
					"date": instance.date.strftime("%A, %d %B %Y"),
					"hours": instance.hours,
					"reason": instance.reason,
					"admin_prefix": get_name_prefix(admin.user),
					"admin_name": admin.user.get_full_name(),
					"admin_job": ""
				}
				if admin.job:
					context.update({"admin_job": admin.job.name})
				email_body = render_to_string('overtimes/admin_to_employee.txt', context)
				send_email_task(message, email_body, settings.OVERTIME_EMAIL, [employee.user.email])
	except:
		pass


@receiver(post_delete, sender=Leave)
def delete_notification(sender, instance, **kwargs):
	notifications = get_instances(Notification, {"_type": "L", "message_id": instance.id})
	if notifications is not None:
		for note in notifications:
			note.delete()


@receiver(post_delete, sender=Overtime)
def delete_notification(sender, instance, **kwargs):
	notifications = get_instances(Notification, {"_type": "O", "message_id": instance.id})
	if notifications is not None:
		for note in notifications:
			note.delete()
