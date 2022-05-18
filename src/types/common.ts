export type PaginationType = {
	limit: number;
	offset: number;
	search?: string;
}

export type DataListType = {
	count: number;
	next?: string;
	previous?: string;
}