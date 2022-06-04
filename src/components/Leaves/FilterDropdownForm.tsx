import { FC, useState } from "react";
import { getDate } from "../../utils";
import { Button, Input } from "../controls";

type FormProps = {
	loading: boolean;
	onSubmit: (form: {fromDate: string; toDate: string}) => void;
}

const Form:FC<FormProps> = ({ loading, onSubmit }) => {
	const [form, setForm] = useState({fromDate: "", toDate: getDate(undefined, true) as string})

	return (
		<form onSubmit={(event) => {
			event.preventDefault()
			onSubmit(form)
		}} className="p-2 w-full">
			<div className="mb-2 w-full">
				<Input 
					disabled={loading}
					label="From"
					name="fromDate"
					onChange={(e) => setForm(prevState => ({...prevState, fromDate: e.target.value}))}
					padding="px-3 py-1"
					required
					rounded="rounded-lg"
					type="date"
					value={form.fromDate}
				/>
			</div>
			<div className="mb-2 w-full">
				<Input 
					disabled={loading}
					label="To"
					name="toDate"
					onChange={(e) => setForm(prevState => ({...prevState, toDate: e.target.value}))}
					padding="px-3 py-1"
					required
					rounded="rounded-lg"
					type="date"
					value={form.toDate}
				/>
			</div>
			<div className="mt-4 mb-2 w-full">
				<Button 
					caps
					disabled={loading}
					loader
					loading={loading}
					padding="px-4 py-1"
					rounded="rounded-lg"
					type="submit"
					title="filter"
				/>	
			</div>
		</form>
	)
}

export default Form;