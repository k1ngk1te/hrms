from jobs.models import Job
from .test_setup import TestSetUp


""" Job List View Tests """
class JobListViewTests(TestSetUp):
	def test_create_and_get_jobs_by_unauthenticated_user(self):
		response1 = self.client.get(self.jobs_url)
		response2 = self.client.post(self.jobs_url, {"name": "job"})

		self.assertEqual(response1.status_code, 401)
		self.assertEqual(response2.status_code, 401)

	def test_get_jobs_by_authenticated_user(self):
		self.client.post(self.login_url, {"email": "employee@example.com","password": "Passing1234"})
		employee = self.client.get(self.jobs_url)

		self.client.post(self.login_url, {"email": "supervisor@example.com","password": "Passing1234"})
		supervisor = self.client.get(self.jobs_url)

		self.client.post(self.login_url, {"email": "hod@example.com","password": "Passing1234"})
		hod = self.client.get(self.jobs_url)

		self.client.post(self.login_url, {"email": "hr@example.com","password": "Passing1234"})
		hr = self.client.get(self.jobs_url)

		self.client.post(self.login_url, {"email": "md@example.com","password": "Passing1234"})
		md = self.client.get(self.jobs_url)

		self.assertEqual(employee.status_code, 403)
		self.assertEqual(supervisor.status_code, 200)
		self.assertEqual(hod.status_code, 200)
		self.assertEqual(hr.status_code, 200)
		self.assertEqual(md.status_code, 200)

	def test_create_jobs_by_authenticated_user(self):
		self.client.post(self.login_url, {"email": "employee@example.com","password": "Passing1234"})
		employee = self.client.post(self.jobs_url, {"name": "job"})

		self.client.post(self.login_url, {"email": "supervisor@example.com","password": "Passing1234"})
		supervisor = self.client.post(self.jobs_url, {"name": "job"})

		self.client.post(self.login_url, {"email": "hod@example.com","password": "Passing1234"})
		hod = self.client.post(self.jobs_url, {"name": "job"})

		self.client.post(self.login_url, {"email": "hr@example.com","password": "Passing1234"})
		hr = self.client.post(self.jobs_url, {"name": "job1"})

		self.client.post(self.login_url, {"email": "md@example.com","password": "Passing1234"})
		md = self.client.post(self.jobs_url, {"name": "job2"})

		response1 = self.client.post(self.jobs_url, {"name": "job2"})
		response2 = self.client.post(self.jobs_url, {})
		response3 = self.client.post(self.jobs_url, {"name": ""})

		self.assertEqual(employee.status_code, 403)
		self.assertEqual(supervisor.status_code, 403)
		self.assertEqual(hod.status_code, 403)
		self.assertEqual(hr.status_code, 201)
		self.assertEqual(md.status_code, 201)
		self.assertEqual(response1.status_code, 400)
		self.assertEqual(response2.status_code, 400)
		self.assertEqual(response3.status_code, 400)

	def test_update_job_by_unauthenticated_user(self):
		job = Job.objects.create(name="firsty")
		response = self.client.put(job.get_absolute_url(), {})
		self.assertEqual(response.status_code, 401)

	def test_update_job_by_authenticated_user(self):
		job = Job.objects.create(name="ffiirrssttyy")
		job1 = Job.objects.create(name="ffiirrssttyy1")
		self.client.post(self.login_url, {"email": self.employee.user.email, 
			"password": "Passing1234"})
		response1 = self.client.put(job.get_absolute_url(), {})

		self.client.post(self.login_url, {"email": self.supervisor.user.email, 
			"password": "Passing1234"})
		response2 = self.client.put(job.get_absolute_url(), {})

		self.client.post(self.login_url, {"email": self.hod.user.email, 
			"password": "Passing1234"})
		response3 = self.client.put(job.get_absolute_url(), {})

		self.client.post(self.login_url, {"email": self.hr.user.email, 
			"password": "Passing1234"})
		response4 = self.client.put(job.get_absolute_url(), {"name": "ffiirrssttyy"})

		self.client.post(self.login_url, {"email": self.md.user.email, 
			"password": "Passing1234"})
		response5 = self.client.put(job.get_absolute_url(), {"name": "ffiirrssttyy1"})

		self.client.post(self.login_url, {"email": self.md.user.email, 
			"password": "Passing1234"})
		response6 = self.client.put(job.get_absolute_url(), {"name": "firsty1"})

		with self.assertRaises(Job.DoesNotExist):
			Job.objects.get(name="ffiirrssttyy")

		try:
			Job.objects.get(name="firsty1")
		except Job.DoesNotExist:
			raise ValueError("Firsty1 Does Not Exist")

		self.assertEqual(response1.status_code, 403)
		self.assertEqual(response2.status_code, 403)
		self.assertEqual(response3.status_code, 403)
		self.assertEqual(response4.status_code, 400)
		self.assertEqual(response5.status_code, 400)
		self.assertEqual(response6.status_code, 200)