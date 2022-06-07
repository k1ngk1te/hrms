from django.conf import settings
from django.template.loader import render_to_string

from common.utils import get_name_prefix, get_leave_type, get_overtime_type
from leaves.tasks import send_email_task
from notifications.models import Notification

def send_leave_email(decision, emp, leave, recipient, position):
	if decision == "A":
		if emp.is_md:
			message = f'{emp.user.get_full_name()} {position} approved your request for a leave.'
			Notification.objects.create(_type="L", sender=emp, recipient=leave.employee,
				message_id=leave.id, message=message)
			context = {	
				"name_prefix": get_name_prefix(leave.employee.user),
				"last_name": leave.employee.user.last_name,
				"leave_type": get_leave_type(leave.leave_type),
				"resume_date": leave.resume_date.strftime("%A, %d %B %Y"),
				"start_date": leave.start_date.strftime("%A, %d %B %Y"),
				"end_date": leave.end_date.strftime("%A, %d %B %Y"),
				"admin_name": emp.user.get_full_name(),
				"admin_job": ""
			}
			if emp.job:
				context.update({"admin_job": emp.job.name})
			email_body = render_to_string('leaves/md_approved_to_employee.txt', context)
			send_email_task(message, email_body, settings.LEAVE_EMAIL, [leave.employee.user.email])
			if leave.created_by != leave.employee and leave.created_by.user.is_staff and leave.created_by.is_md is False:
				message = f'{emp.user.get_full_name()} {position} approved the request for a leave.'
				Notification.objects.create(_type="L", sender=emp, recipient=leave.created_by,
					message_id=leave.id, message=message)
				context = {	
					"name_prefix": get_name_prefix(leave.created_by.user),
					"last_name": leave.created_by.user.last_name,
					"emp_name": leave.employee.user.get_full_name().capitalize(),
					"leave_type": get_leave_type(leave.leave_type),
					"resume_date": leave.resume_date.strftime("%A, %d %B %Y"),
					"start_date": leave.start_date.strftime("%A, %d %B %Y"),
					"end_date": leave.end_date.strftime("%A, %d %B %Y"),
					"admin_name": emp.user.get_full_name(),
					"admin_job": ""
				}
				if emp.job:
					context.update({"admin_job": emp.job.name})
				email_body = render_to_string('leaves/md_approved_to_admin.txt', context)
				send_email_task(message, email_body, settings.LEAVE_EMAIL, [leave.created_by.user.email])
		else:
			message=f"{leave.employee.user.get_full_name().upper()} sent a request for leave"
			Notification.objects.create(_type="L", sender=leave.employee, recipient=recipient,
				message=message, message_id=leave.id)
			context = {	
				"name_prefix": get_name_prefix(recipient.user),
				"last_name": recipient.user.last_name,
				"leave_type": get_leave_type(leave.leave_type),
				"resume_date": leave.resume_date.strftime("%A, %d %B %Y"),
				"start_date": leave.start_date.strftime("%A, %d %B %Y"),
				"end_date": leave.end_date.strftime("%A, %d %B %Y"),
				"employee_name": leave.employee.user.get_full_name(),
				"reason": leave.reason
			}
			email_body = render_to_string('leaves/employee_to_admin.txt', context)
			send_email_task(message, email_body, settings.LEAVE_EMAIL, [recipient.user.email])
	elif decision == "D":
		message = f'{emp.user.get_full_name()} {position} denied your request for a leave.'
		Notification.objects.create(_type="L", sender=emp, recipient=leave.employee,
			message_id=leave.id, message=message)
		context = {	
			"name_prefix": get_name_prefix(leave.employee.user),
			"last_name": leave.employee.user.last_name,
			"leave_type": get_leave_type(leave.leave_type),
			"resume_date": leave.resume_date.strftime("%A, %d %B %Y"),
			"start_date": leave.start_date.strftime("%A, %d %B %Y"),
			"person": "your",
			"end_date": leave.end_date.strftime("%A, %d %B %Y"),
			"admin_name": emp.user.get_full_name(),
			"admin_job": ""
		}

		if emp.job:
			context.update({"admin_job": emp.job.name})
		email_body = render_to_string('leaves/md_denied_to_employee.txt', context)
		send_email_task(message, email_body, settings.LEAVE_EMAIL, [leave.employee.user.email])
		if leave.created_by != leave.employee and leave.created_by.is_staff:
			message = f'{emp.user.get_full_name()} {position} denied the request for a leave.'
			Notification.objects.create(_type="L", sender=emp, recipient=leave.created_by,
				message_id=leave.id, message=message)
			context = {	
				"name_prefix": get_name_prefix(leave.created_by.user),
				"last_name": leave.created_by.user.last_name,
				"emp_name": leave.employee.user.get_full_name().capitalize(),
				"leave_type": get_leave_type(leave.leave_type),
				"resume_date": leave.resume_date.strftime("%A, %d %B %Y"),
				"start_date": leave.start_date.strftime("%A, %d %B %Y"),
				"end_date": leave.end_date.strftime("%A, %d %B %Y"),
				"person": "the",
				"admin_name": emp.user.get_full_name(),
				"admin_job": ""
			}
			if emp.job:
				context.update({"admin_job": emp.job.name})
			email_body = render_to_string('leaves/md_denied_to_employee.txt', context)
			send_email_task(message, email_body, settings.LEAVE_EMAIL, [leave.created_by.user.email])



def send_overtime_email(decision, emp, overtime, recipient, position):
	if decision == "A":
		if emp.is_md:
			message = f'{emp.user.get_full_name()} {position} approved your request for overtime.'
			Notification.objects.create(_type="O", sender=emp, recipient=overtime.employee,
				message_id=overtime.id, message=message)
			context = {	
				"name_prefix": get_name_prefix(overtime.employee.user),
				"last_name": overtime.employee.user.last_name,
				"overtime_type": get_overtime_type(overtime.overtime_type),
				"date": overtime.date.strftime("%A, %d %B %Y"),
				"hours": overtime.hours,
				"admin_name": emp.user.get_full_name(),
				"admin_job": ""
			}
			if emp.job:
				context.update({"admin_job": emp.job.name})
			email_body = render_to_string('overtimes/md_approved_to_employee.txt', context)
			send_email_task(message, email_body, settings.OVERTIME_EMAIL, [overtime.employee.user.email])
			if overtime.created_by != overtime.employee and overtime.created_by.user.is_staff and overtime.created_by.is_md is False:
				message = f'{emp.user.get_full_name()} {position} approved the request for overtime.'
				Notification.objects.create(_type="O", sender=emp, recipient=overtime.created_by,
					message_id=overtime.id, message=message)
				context = {	
					"name_prefix": get_name_prefix(overtime.created_by.user),
					"last_name": overtime.created_by.user.last_name,
					"emp_name": overtime.employee.user.get_full_name().capitalize(),
					"overtime_type": get_overtime_type(overtime.overtime_type),
					"date": overtime.date.strftime("%A, %d %B %Y"),
					"hours": overtime.hours,
					"admin_name": emp.user.get_full_name(),
					"admin_job": ""
				}
				if emp.job:
					context.update({"admin_job": emp.job.name})
				email_body = render_to_string('overtimes/md_approved_to_admin.txt', context)
				send_email_task(message, email_body, settings.OVERTIME_EMAIL, [overtime.created_by.user.email])
		else:
			message=f"{overtime.employee.user.get_full_name().upper()} sent a request for overtime."
			Notification.objects.create(_type="O", sender=overtime.employee, recipient=recipient,
				message=message, message_id=overtime.id)
			context = {	
				"name_prefix": get_name_prefix(recipient.user),
				"last_name": recipient.user.last_name,
				"overtime_type": get_overtime_type(overtime.overtime_type),
				"date": overtime.date.strftime("%A, %d %B %Y"),
				"hours": overtime.hours,
				"employee_name": overtime.employee.user.get_full_name(),
				"reason": overtime.reason
			}
			email_body = render_to_string('overtimes/employee_to_admin.txt', context)
			send_email_task(message, email_body, settings.OVERTIME_EMAIL, [recipient.user.email])
	elif decision == "D":
		message = f'{emp.user.get_full_name()} {position} denied your request for overtime.'
		Notification.objects.create(_type="O", sender=emp, recipient=overtime.employee,
			message_id=overtime.id, message=message)
		context = {	
			"name_prefix": get_name_prefix(overtime.employee.user),
			"last_name": overtime.employee.user.last_name,
			"overtime_type": get_overtime_type(overtime.overtime_type),
			"date": overtime.date.strftime("%A, %d %B %Y"),
			"hours": overtime.hours,
			"person": "your",
			"admin_name": emp.user.get_full_name(),
			"admin_job": ""
		}

		if emp.job:
			context.update({"admin_job": emp.job.name})
		email_body = render_to_string('overtimes/md_denied_to_employee.txt', context)
		send_email_task(message, email_body, settings.OVERTIME_EMAIL, [overtime.employee.user.email])
		if overtime.created_by != overtime.employee and overtime.created_by.is_staff:
			message = f'{emp.user.get_full_name()} {position} denied the request for overtime.'
			Notification.objects.create(_type="O", sender=emp, recipient=overtime.created_by,
				message_id=overtime.id, message=message)
			context = {	
				"name_prefix": get_name_prefix(overtime.created_by.user),
				"last_name": overtime.created_by.user.last_name,
				"emp_name": overtime.employee.user.get_full_name().capitalize(),
				"overtime_type": get_overtime_type(overtime.overtime_type),
				"date": overtime.date.strftime("%A, %d %B %Y"),
				"hours": overtime.hours,
				"person": "the",
				"admin_name": emp.user.get_full_name(),
				"admin_job": ""
			}
			if emp.job:
				context.update({"admin_job": emp.job.name})
			email_body = render_to_string('overtimes/md_denied_to_employee.txt', context)
			send_email_task(message, email_body, settings.OVERTIME_EMAIL, [overtime.created_by.user.email])


