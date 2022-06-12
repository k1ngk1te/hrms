from rest_framework.exceptions import ValidationError

from common.utils import get_instance
from .models import Employee

def get_employees(key, employee_list=None):
	if not employee_list or len(employee_list) <= 0:
		return []
	employees = []
	for employee in employee_list:
		id = employee.get("id", None)
		if id is None:
			raise ValidationError({key: "Employee ID is required!"})
		instance = get_instance(Employee, {"id": id})
		if not instance:
			raise ValidationError({key: (
				f"There is no employee with ID {id}")
				})
		if instance.status.lower() != "active":
			raise ValidationError({key: (
				f"Employee with ID {id}",
				f"is {instance.status.lower()}" )
			})
		employees.append(instance)
	return employees
