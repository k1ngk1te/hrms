from django.db import IntegrityError
from django.test import TestCase

from common.utils import get_instance
from jobs.models import Job


class JobTests(TestCase):

	def test_create_jobs(self):
		job = Job.objects.create(name="human resource manager")

		response = get_instance(Job, {"name": "human resource manager"})

		self.assertIsNotNone(response)
		self.assertEqual(job.name, "human resource manager")

		with self.assertRaises(IntegrityError):
			Job.objects.create(name="human resource manager")
