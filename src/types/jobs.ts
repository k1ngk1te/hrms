import { DataListType } from "./common";

export type JobType = {
	id: string;
	name: string;
}

export interface GetJobsDataType extends DataListType {
	results: JobType[]
}