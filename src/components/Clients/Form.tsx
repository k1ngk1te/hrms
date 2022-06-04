import { FC, useCallback, useEffect, useState } from "react";
import { useFormInput, useFormSelect, useFormTextArea } from "../../hooks";
import { toCapitalize, validateForm } from "../../utils";
import { Button, File, Input, Select, Textarea } from "../controls";
import { ClientCreateType, ClientFormErrorType } from "../../types/employees";

export type FormProps = {
	editMode?: boolean;
	errors?: ClientFormErrorType,
	initState?: InitStateType;
	loading: boolean;
	success?: boolean;
	onSubmit: (form: ClientCreateType) => void;
};

const initialState = {
	image: undefined,
	first_name: "",
	last_name: "",
	email: "",
	date_of_birth: "",
	gender: "M",
	state: "",
	city: "",
	phone: "",
	address: "",
	company: "",
	position: "",
};

type InitStateType = typeof initialState;
interface InitErrorType extends Omit<InitStateType, "image" | "gender"> {
	image: string;
	gender: string;
}

const initErrorState: InitErrorType | undefined = {
	image: "",
	first_name: "",
	last_name: "",
	email: "",
	date_of_birth: "",
	gender: "",
	state: "",
	city: "",
	phone: "",
	address: "",
	company: "",
	position: "",
};

type InitErrorKeysType =
	| "image"
	| "first_name"
	| "last_name"
	| "email"
	| "date_of_birth"
	| "gender"
	| "state"
	| "city"
	| "phone"
	| "address"
	| "company"
	| "position";

const Form: FC<FormProps> = ({ editMode, errors, initState = initialState, loading, onSubmit, success }) => {
	const [formErrors, setErrors] = useState<InitErrorType>(initErrorState);

	const removeErrors = useCallback(
		(name: InitErrorKeysType) => {
			if (
				formErrors &&
				formErrors[name] &&
				(formErrors[name] !== "" ||
					formErrors[name] !== undefined ||
					formErrors[name] !== null)
			)
				setErrors((prevState) => ({
					...prevState,
					[name]: "",
				}));
		},
		[formErrors]
	);

	const company = useFormInput(initState.company, {
		onChange: () => (removeErrors ? removeErrors("company") : ""),
	});
	const position = useFormInput(initState.position, {
		onChange: () => (removeErrors ? removeErrors("position") : ""),
	});
	const image = useFormInput(initState.image, {
		onChange: () => (removeErrors ? removeErrors("image") : ""),
	});
	const first_name = useFormInput(initState.first_name, {
		onChange: () => (removeErrors ? removeErrors("first_name") : ""),
	});
	const last_name = useFormInput(initState.last_name, {
		onChange: () => (removeErrors ? removeErrors("last_name") : ""),
	});
	const email = useFormInput(initState.email, {
		onChange: () => (removeErrors ? removeErrors("email") : ""),
	});
	const gender = useFormSelect(initState.gender, {
		onChange: () => (removeErrors ? removeErrors("gender") : ""),
	});
	const address = useFormTextArea(initState.address, {
		onChange: () => (removeErrors ? removeErrors("address") : ""),
	});
	const phone = useFormInput(initState.phone, {
		onChange: () => (removeErrors ? removeErrors("phone") : ""),
	});
	const state = useFormInput(initState.state, {
		onChange: () => (removeErrors ? removeErrors("state") : ""),
	});
	const city = useFormInput(initState.city, {
		onChange: () => (removeErrors ? removeErrors("city") : ""),
	});
	const date_of_birth = useFormInput(initState.date_of_birth, {
		onChange: () => (removeErrors ? removeErrors("date_of_birth") : ""),
	});

	const companyReset = company.reset;
	const positionReset = position.reset;
	const imageReset = image.reset;
	const firstNameReset = first_name.reset;
	const lastNameReset = last_name.reset;
	const emailReset = email.reset;
	const genderReset = gender.reset;
	const addressReset = address.reset;
	const phoneReset = phone.reset;
	const stateReset = state.reset;
	const cityReset = city.reset;
	const dobReset = date_of_birth.reset;

	useEffect(() => {
		if (!editMode && success) {
			setErrors(initErrorState)
			imageReset();
			firstNameReset();
			lastNameReset();
			emailReset();
			genderReset();
			addressReset();
			phoneReset();
			stateReset();
			cityReset();
			dobReset();
			companyReset();
			positionReset();
		}
	}, [
		success,
		editMode,
		imageReset,
		firstNameReset,
		lastNameReset,
		emailReset,
		genderReset,
		addressReset,
		phoneReset,
		stateReset,
		cityReset,
		dobReset,
		companyReset,
		positionReset,
	]);

	const handleSubmit = useCallback(
		(form: ClientCreateType) => {
			const invalidates = ["state", "city", "address", "date_of_birth"]
			if (editMode) invalidates.push("image")
			const { valid, result } = validateForm(form, invalidates);
			if (valid)
				onSubmit(form)
			else if (valid === false) setErrors(result)
		},
		[editMode, onSubmit]
	);

	const imageError =
		typeof formErrors?.image === "string" ? formErrors?.image : "";

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit({
					contact: {
						first_name: first_name.value,
						last_name: last_name.value,
						email: email.value,
						profile: {
							image: image.value,
							address: address.value,
							date_of_birth: date_of_birth.value,
							gender: gender.value,
							phone: phone.value,
							state: state.value,
							city: city.value,
						},
					},
					company: company.value,
					position: position.value
				});
			}}
			className="p-4"
		>
			<div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<div className="w-full md:w-1/2 lg:w-1/3">
						<File
							disabled={loading}
							error={imageError || errors?.profile?.image}
							label="Image"
							onChange={image.onChange}
							placeholder="upload image"
							required={editMode ? false : true}
							value={image.value?.name || ""}
						/>
					</div>
				</div>
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.company || errors?.company || ""}
						label="Company"
						onChange={company.onChange}
						placeholder="Enter company name"
						required
						value={company.value}
					/>
				</div>
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.position || errors?.position || ""}
						label="Position"
						onChange={position.onChange}
						placeholder="Enter client position in the company"
						required
						value={position.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.first_name || errors?.contact?.first_name || ""}
						label="First Name"
						onChange={first_name.onChange}
						placeholder="First Name"
						required
						value={first_name.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.last_name || errors?.contact?.last_name || ""}
						label="Last Name"
						onChange={last_name.onChange}
						placeholder="Last Name"
						required
						value={last_name.value}
					/>
				</div>
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.email || errors?.contact?.email || ""}
						label="Email"
						onChange={email.onChange}
						placeholder="Email"
						required
						type="email"
						value={email.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.phone || errors?.profile?.phone || ""}
						label="Phone Number"
						onChange={phone.onChange}
						placeholder="Phone Number"
						required
						value={phone.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Select
						disabled={loading}
						error={formErrors?.gender || errors?.profile?.gender || ""}
						label="Gender"
						onChange={gender.onChange}
						options={[
							{ title: "Male", value: "M" },
							{ title: "Female", value: "F" },
						]}
						required
						value={gender.value}
					/>
				</div>
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<Textarea
						badge={{
							bg: "info",
							margin: "mx-0",
							title: "optional"
						}}
						disabled={loading}
						error={formErrors?.address || errors?.profile?.address || ""}
						label="Address"
						onChange={address.onChange}
						placeholder="Address"
						required={false}
						value={address.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						badge={{
							bg: "info",
							margin: "mx-0",
							title: "optional"
						}}
						disabled={loading}
						error={formErrors?.state || errors?.profile?.state || ""}
						label="State"
						onChange={state.onChange}
						placeholder="State"
						required={false}
						value={state.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						badge={{
							bg: "info",
							margin: "mx-0",
							title: "optional"
						}}
						disabled={loading}
						error={formErrors?.city || errors?.profile?.city || ""}
						label="City"
						onChange={city.onChange}
						placeholder="City"
						required={false}
						value={city.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						badge={{
							bg: "info",
							margin: "mx-0",
							title: "optional"
						}}
						disabled={loading}
						error={
							formErrors?.date_of_birth || errors?.profile?.date_of_birth || ""
						}
						label="Date Of Birth"
						onChange={date_of_birth.onChange}
						placeholder="Date Of Birth"
						required={false}
						type="date"
						value={date_of_birth.value}
					/>
				</div>
			</div>
			<div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
				<div className="w-full sm:w-1/2 md:w-1/3">
					<Button
						disabled={loading}
						loader
						loading={loading}
						title="submit"
						type="submit"
					/>
				</div>
			</div>
		</form>
	);
};

Form.defaultProps = {
	editMode: false,
};

export default Form;
