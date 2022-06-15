import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cookie from "react-cookies";
import { CSRF_HEADER_KEY, CSRF_TOKEN } from "../../config";

export const baseApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: "",
		prepareHeaders: (headers) => {
			if (!headers.get("Accept")) headers.set("Accept", "application/json");
			if (!headers.get("default-content-type"))
				if (!headers.get("Content-Type")) headers.set("Content-Type", "application/json");
			const csrftoken = cookie.load(CSRF_TOKEN);
			if (csrftoken) headers.set(CSRF_HEADER_KEY, csrftoken);
			return headers;
		},
	}),
	endpoints: () => ({}),
	reducerPath: "baseApi",
	tagTypes: [
		"Attendance",
		"Client",
		"Company",
		"Department",
		"Employee",
		"Holiday",
		"Job",
		"Leave",
		"LeaveAdmin",
		"Notification",
		"Overtime",
		"OvertimeAdmin",
		"Profile",
		"Project",
		"Task",
		"User",
	],
});

export default baseApi;
