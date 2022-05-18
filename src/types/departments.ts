import { DataListType } from "./common";
import { UserInfoType } from "./user";


export type DepartmentType = {
	name: string;
	id: string | number;
	hod?: number;
	hod_info?: UserInfoType;
	no_of_employees?: number;
}

export interface GetDepartmentsDataType extends DataListType {
	results: DepartmentType[];
}