import { DataListType } from "./common";

export type JobType = {
	id: string | number;
	name: string;
}

export interface GetJobsDataType extends DataListType {
	results: JobType[]
}