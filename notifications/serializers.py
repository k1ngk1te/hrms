from common.utils import get_user_info
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
	sender = serializers.SerializerMethodField('get_sender_info')
	recipient = serializers.SerializerMethodField('get_recipient_info')

	class Meta:
		model = Notification
		fields = ("id", "_type", "sender", "recipient", "message", "message_id", "read", "date_sent")

	def get_sender_info(self, obj):
		return get_user_info(obj.sender.user, self.context.get('request'))

	def get_recipient_info(self, obj):
		return get_user_info(obj.recipient.user, self.context.get('request'))