import { baseApi } from "./base";
import {
	DATA_LIFETIME,
	NOTIFICATIONS_URL,
	NOTIFICATION_URL,
} from "../../config";
import { PaginationType } from "../../types/common";
import { GetNotificationsDataType } from "../../types/notifications";

const notificationsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		notifications: build.query<GetNotificationsDataType, PaginationType>({
			query: ({ limit, offset }) => ({
				url: `${NOTIFICATIONS_URL}?offset=${offset}&limit=${limit}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Notification" as const, id })),
							{ type: "Notification" as const, id: "NOTIFICATION_LIST" },
					  ]
					: [{ type: "Notification" as const, id: "NOTIFICATION_LIST" }],
		}),
		deleteNotification: build.mutation<{ success: string }, string | number>({
			query: (id) => ({
				url: NOTIFICATION_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Notification", id }] : [],
		}),
	}),
	overrideExisting: false,
});

export const {
	useNotificationsQuery,
	useDeleteNotificationMutation,
} = notificationsApi;
