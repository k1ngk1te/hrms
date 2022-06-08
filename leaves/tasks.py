from celery import shared_task
from celery.utils.log import get_task_logger
from django.conf import settings
from django.core.mail import EmailMessage

logger = get_task_logger(__name__)

@shared_task
def send_email_task(message, body, _from, to):
	if isinstance(to, list) is False and isinstance(to, tuple) is False:
		to = [to]
	if _from is None:
		_from = settings.DEFAULT_FROM_EMAIL
	email = EmailMessage(message, body, _from, to)
	logger.info("Sent E-mail")
	return email.send(fail_silently=False)