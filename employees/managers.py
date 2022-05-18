from django.db import models
from django.db.models import Q

# Querysets


class EmployeeQuerySet(models.QuerySet):
	def get_employees(self, emp):
		if emp.is_md:
			return self.exclude(is_md=True)
		elif emp.is_hr:
			return self.exclude(Q(is_md=True) | Q(is_hr=True))
		elif emp.is_hod:
			return self.exclude(
				Q(is_md=True) | 
				Q(is_hr=True) |
				Q(id=emp.id)).filter(department__hod=emp)
		elif emp.is_supervisor:
			return self.filter(supervisor=emp)
		else:
			return self.none()


# Managers


class EmployeeManager(models.Manager):

	def get_queryset(self):
		return EmployeeQuerySet(self.model, using=self._db)

	def employees(self, emp):
		return self.get_queryset().get_employees(emp)