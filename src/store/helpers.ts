import { ClientCreateType, FormType } from "../types/employees";

export const generateEmployee = (data: FormType) => {
	const form = new FormData();

	form.append("user.email", data.email);
	form.append("user.first_name", data.first_name);
	form.append("user.last_name", data.last_name);
	form.append("profile.gender", data.gender);
	form.append("profile.phone", data.phone);
	form.append("profile.address", data.address);
	form.append("profile.state", data.state);
	form.append("profile.city", data.city);
	form.append("profile.date_of_birth", data.date_of_birth);
	form.append("job.id", data.job);
	form.append("department.id", data.department);
	form.append("date_employed", data.date_employed);
	data.image && form.append("profile.image", data.image);
	data.supervisor && form.append("supervisor.id", data.supervisor);

	return form;
};

export const generateClient = (data: ClientCreateType) => {
	const form = new FormData()

	form.append("company", data.company)
	form.append("position", data.position)
	form.append("contact.first_name", data.contact.first_name)
	form.append("contact.last_name", data.contact.last_name)
	form.append("contact.email", data.contact.email)
	data.contact.profile.image && form.append("contact.profile.image", data.contact.profile.image)
	form.append("contact.profile.phone", data.contact.profile.phone)
	form.append("contact.profile.gender", data.contact.profile.gender)
	form.append("contact.profile.address", data.contact.profile.address)
	form.append("contact.profile.state", data.contact.profile.state)
	form.append("contact.profile.city", data.contact.profile.city)
	form.append("contact.profile.date_of_birth", data.contact.profile.date_of_birth)

	return form
}