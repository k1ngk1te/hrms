from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from common.utils import (
	get_instance, 
	get_instances,
	get_leave_type, 
	get_overtime_type, 
	get_name_prefix as get_prefix
)
from employees.models import Employee
from leaves.models import Leave, Overtime
from .models import Notification


def send_leave_notification(sender, recipient, reason, message, message_id, _type="request"):

	if isinstance(sender, Employee) is False:
		raise TypeError("Sender is not an Employee instance")

	if isinstance(recipient, Employee) is False:
		raise TypeError("Recipient is not an Employee instance")

	instance = get_instance(Leave, {"id": message_id})
	if instance is None:
		raise Leave.DoesNotExist

	if instance is None:
		raise ValueError("Leave does not exist!")

	notification   = Notification.objects.create(
		_type      = "L",
		sender     = sender,
		recipient  = recipient,
		message    = message,
		message_id = message_id,
		read       = False
	)
	context = {	
		"name_prefix": get_prefix(recipient.user),
		"last_name": recipient.user.last_name,
		"leave_type": get_leave_type(instance.leave_type),
		"resume_date": instance.resume_date.strftime("%A, %d %B %Y"),
		"start_date": instance.start_date.strftime("%A, %d %B %Y"),
		"end_date": instance.end_date.strftime("%A, %d %B %Y"),
		"employee_name": instance.employee.user.get_full_name(),
		"reason": reason
	}
	email_body = render_to_string('leaves/request.txt', context)
	if _type == "admin_request":
		context = {	
			"name_prefix": get_prefix(recipient.user),
			"last_name": recipient.user.last_name,
			"leave_type": get_leave_type(instance.leave_type),
			"resume_date": instance.resume_date.strftime("%A, %d %B %Y"),
			"start_date": instance.start_date.strftime("%A, %d %B %Y"),
			"end_date": instance.end_date.strftime("%A, %d %B %Y"),
			"emp_prefix": get_prefix(instance.employee.user),
			"emp_name": instance.employee.user.get_full_name(),
			"reason": reason,
			"admin_name": instance.created_by.user.get_full_name(),
			"admin_job": instance.created_by.job.name
		}
		email_body = render_to_string('leaves/admin_request.txt', context)

	elif _type == "approved" or _type == "denied":
		context = {	
			"name_prefix": get_prefix(recipient.user),
			"last_name": recipient.user.last_name,
			"leave_type": get_leave_type(instance.leave_type),
			"resume_date": instance.resume_date.strftime("%A, %d %B %Y"),
			"start_date": instance.start_date.strftime("%A, %d %B %Y"),
			"end_date": instance.end_date.strftime("%A, %d %B %Y"),
			"admin_name": sender.user.get_full_name(),
			"admin_job": sender.job.name
		}
		if _type == "approved":
			email_body = render_to_string('leaves/approved.txt', context)
		else:
			email_body = render_to_string('leaves/denied.txt', context)


	email = EmailMessage(
		message,
		email_body,
		settings.LEAVE_EMAIL,
		[recipient.user.email]
	)
	email.send(fail_silently=False)

	return notification;


def send_overtime_notification(sender, recipient, reason, message, message_id, _type="request"):

	if isinstance(sender, Employee) is False:
		raise TypeError("Sender is not an Employee instance")

	if isinstance(recipient, Employee) is False:
		raise TypeError("Recipient is not an Employee instance")

	instance = get_instance(Overtime, {"id": message_id})
	if instance is None:
		raise Overtime.DoesNotExist

	if instance is None:
		raise ValueError("Overtime does not exist!")

	notification   = Notification.objects.create(
		_type      = "O",
		sender     = sender,
		recipient  = recipient,
		message    = message,
		message_id = message_id,
		read       = False
	)
	context = {	
		"name_prefix": get_prefix(recipient.user),
		"last_name": recipient.user.last_name,
		"overtime_type": get_overtime_type(instance.overtime_type),
		"date": instance.date.strftime("%A, %d %B %Y"),
		"hours": instance.hours.strftime("%A, %d %B %Y"),
		"employee_name": instance.employee.user.get_full_name(),
		"reason": reason
	}
	email_body = render_to_string('overtimes/request.txt', context)
	if _type == "admin_request":
		context = {	
			"name_prefix": get_prefix(recipient.user),
			"last_name": recipient.user.last_name,
			"overtime_type": get_overtime_type(instance.overtime_type),
			"date": instance.date.strftime("%A, %d %B %Y"),
			"hours": instance.hours.strftime("%A, %d %B %Y"),
			"emp_prefix": get_prefix(instance.employee.user),
			"emp_name": instance.employee.user.get_full_name(),
			"reason": reason,
			"admin_name": instance.created_by.user.get_full_name(),
			"admin_job": instance.created_by.job.name
		}
		email_body = render_to_string('overtimes/admin_request.txt', context)

	elif _type == "approved" or _type == "denied":
		context = {	
			"name_prefix": get_prefix(recipient.user),
			"last_name": recipient.user.last_name,
			"overtime_type": get_overtime_type(instance.overtime_type),
			"date": instance.date.strftime("%A, %d %B %Y"),
			"hours": instance.hours.strftime("%A, %d %B %Y"),
			"admin_name": sender.user.get_full_name(),
			"admin_job": sender.job.name
		}
		if _type == "approved":
			email_body = render_to_string('overtimes/approved.txt', context)
		else:
			email_body = render_to_string('overtimes/denied.txt', context)


	email = EmailMessage(
		message,
		email_body,
		settings.OVERTIME_EMAIL,
		[recipient.user.email]
	)
	email.send(fail_silently=False)

	return notification;

