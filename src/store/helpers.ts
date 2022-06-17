import { ClientCreateType, FormType } from "../types/employees";
import { ProfileFormType } from "../types/user";

export const generateProfile = (profile: ProfileFormType) => {
	const form = new FormData();
	profile.city && form.append("city", profile.city);
	profile.image && form.append("image", profile.image);
	profile.phone && form.append("phone", profile.phone);
	profile.state && form.append("state", profile.state);
	profile.gender && form.append("gender", profile.gender);
	profile.address && form.append("address", profile.address);
	profile.date_of_birth && form.append("date_of_birth", profile.date_of_birth);

	if (profile.user) {
		profile.user.first_name &&
			form.append("user.first_name", profile.user.first_name);
		profile.user.last_name &&
			form.append("user.last_name", profile.user.last_name);
	}
	return form;
};

export const generateEmployee = (data: FormType) => {
	const form = new FormData();

	data.job && form.append("job.id", data.job);
	data.city && form.append("profile.city", data.city);
	data.email && form.append("user.email", data.email);
	data.image && form.append("profile.image", data.image);
	data.phone && form.append("profile.phone", data.phone);
	data.state && form.append("profile.state", data.state);
	data.gender && form.append("profile.gender", data.gender);
	data.address && form.append("profile.address", data.address);
	data.last_name && form.append("user.last_name", data.last_name);
	data.first_name && form.append("user.first_name", data.first_name);
	data.department && form.append("department.id", data.department);
	data.supervisor && form.append("supervisor.id", data.supervisor);
	data.date_employed && form.append("date_employed", data.date_employed);
	data.date_of_birth &&
		form.append("profile.date_of_birth", data.date_of_birth);

	return form;
};

export const generateClient = (data: ClientCreateType) => {
	const form = new FormData();

	data.company && form.append("company", data.company);
	data.position && form.append("position", data.position);
	if (data.contact) {
		const contact = data.contact;
		contact.first_name && form.append("contact.first_name", contact.first_name);
		contact.last_name && form.append("contact.last_name", contact.last_name);
		contact.email && form.append("contact.email", contact.email);
		if (contact.profile) {
			const profile = contact.profile;
			profile.image && form.append("contact.profile.image", profile.image);
			profile.phone && form.append("contact.profile.phone", profile.phone);
			profile.gender && form.append("contact.profile.gender", profile.gender);
			profile.address &&
				form.append("contact.profile.address", profile.address);
			profile.state && form.append("contact.profile.state", profile.state);
			profile.city && form.append("contact.profile.city", profile.city);
			profile.date_of_birth &&
				form.append("contact.profile.date_of_birth", profile.date_of_birth);
		}
	}

	return form;
};
