import { FormEvent, FC, useCallback, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import { isErrorWithData, isFormError } from "../../store";
import { logout } from "../../store/features/auth-slice";
import { useUpdateProfileMutation } from "../../store/features/auth-api-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { close as modalClose } from "../../store/features/modal-slice";
import {
	useAppDispatch,
	useFormInput,
	useFormSelect,
	useFormTextArea,
} from "../../hooks";
import { omitKey, validateForm } from "../../utils";
import { EmployeeType } from "../../types/employees";
import { Button, File, Input, Select, Textarea } from "../controls";

type FormProps = {
	initState?: EmployeeType;
};

type ErrorType = {
	image?: string;
	user?: {
		first_name?: string;
		last_name?: string;
	};
	gender?: string;
	address?: string;
	phone?: string;
	state?: string;
	city?: string;
	date_of_birth?: string;
};

const Form: FC<FormProps> = ({ initState }) => {
	const [loading, setLoading] = useState(false);
	const [formErrors, setErrors] = useState<any>({});

	const dispatch = useAppDispatch();

	const [updateProfile, { data, error, status }] = useUpdateProfileMutation();
	const errors = isFormError<ErrorType>(error) ? error.data : undefined;

	const image = useFormInput("");
	const first_name = useFormInput(initState?.user?.first_name);
	const last_name = useFormInput(initState?.user?.last_name);
	const gender = useFormSelect(initState?.profile?.gender.value);

	const address = useFormTextArea(initState?.profile?.address);
	const phone = useFormInput(initState?.profile?.phone);
	const state = useFormInput(initState?.profile?.state);
	const city = useFormInput(initState?.profile?.city);
	const date_of_birth = useFormInput(initState?.profile?.date_of_birth);

	const handleSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setLoading(true);

			const form = {
				image: image.value,
				user: {
					first_name: first_name.value,
					last_name: last_name.value,
				},
				gender: gender.value,
				address: address.value,
				phone: phone.value,
				state: state.value,
				city: city.value,
				date_of_birth: date_of_birth.value,
			};

			const omitForm = omitKey(form, ["image"]);
			const { valid, result } = validateForm(omitForm);

			if (valid) {
				updateProfile({
					profile: form,
				});
			} else if (valid === false) {
				setErrors(result);
				setLoading(false);
			}
		},
		[
			updateProfile,
			dispatch,
			image.value,
			first_name.value,
			last_name.value,
			gender.value,
			address.value,
			phone.value,
			state.value,
			city.value,
			date_of_birth.value,
		]
	);

	useEffect(() => {
		if (status !== "pending") setLoading(false);
		if (status === "fulfilled") {
			dispatch(modalClose());
			dispatch(
				alertModalOpen({
					color: "success",
					decisions: [
						{
							color: "success",
							title: "OK",
						},
					],
					Icon: FaCheckCircle,
					header: "Profile Updated",
					message: "Profile information was updated successfully!",
				})
			);
		}
	}, [dispatch, status]);

	return (
		<form onSubmit={handleSubmit} className="p-4">
			<div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
				<div className="w-full md:col-span-2">
					<div className="w-full md:w-1/2 lg:w-1/3">
						<File
							disabled={loading}
							error={formErrors?.image || errors?.image}
							label="Image"
							onChange={image.onChange}
							placeholder="upload image"
							required={false}
							value={image.value?.name || ""}
						/>
					</div>
				</div>
				<div className="w-full">
					<Input
						disabled={loading}
						error={formErrors?.first_name || errors?.user?.first_name || ""}
						label="First Name"
						onChange={first_name.onChange}
						placeholder="First Name"
						required
						value={first_name.value}
					/>
				</div>
				<div className="w-full">
					<Input
						disabled={loading}
						error={formErrors?.last_name || errors?.user?.last_name || ""}
						label="Last Name"
						onChange={last_name.onChange}
						placeholder="Last Name"
						required
						value={last_name.value}
					/>
				</div>
				<div className="w-full">
					<Select
						disabled={loading}
						error={formErrors?.gender || errors?.gender || ""}
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
				<div className="w-full">
					<Input
						disabled={loading}
						error={formErrors?.phone || errors?.phone || ""}
						label="Phone Number"
						onChange={phone.onChange}
						placeholder="Phone Number"
						required
						value={phone.value}
					/>
				</div>

				<div className="w-full md:col-span-2">
					<Textarea
						disabled={loading}
						error={formErrors?.address || errors?.address || ""}
						label="Address"
						onChange={address.onChange}
						placeholder="Address"
						required
						value={address.value}
					/>
				</div>
				<div className="w-full">
					<Input
						disabled={loading}
						error={formErrors?.state || errors?.state || ""}
						label="State"
						onChange={state.onChange}
						placeholder="State"
						required
						value={state.value}
					/>
				</div>
				<div className="w-full">
					<Input
						disabled={loading}
						error={formErrors?.city || errors?.city || ""}
						label="City"
						onChange={city.onChange}
						placeholder="City"
						required
						value={city.value}
					/>
				</div>
				<div className="w-full">
					<Input
						disabled={loading}
						error={formErrors?.date_of_birth || errors?.date_of_birth || ""}
						label="Date Of Birth"
						onChange={date_of_birth.onChange}
						placeholder="Date Of Birth"
						required
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

export default Form;
