import { DataListType } from "./common";
import { UserEmployeeType } from "./employees";


export type DepartmentType = {
	name: string;
	id: string;
	hod?: UserEmployeeType;
	no_of_employees?: number;
}

export type DepartmentCreateType = {
	name: string;
	hod?: {
		id: string;
	}
}

export interface GetDepartmentsDataType extends DataListType {
	results: DepartmentType[];
}
