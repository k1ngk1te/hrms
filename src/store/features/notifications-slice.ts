import { baseApi } from "./base";
import { DATA_LIFETIME, NOTIFICATIONS_URL, NOTIFICATION_URL } from "../../config";
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
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Notification"],
		}),
		deleteNotification: build.mutation<{ success: string }, string | number>({
			query: (id) => ({
				url: NOTIFICATION_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error) => !error ? ["Notification"] : [],
		}),
	}),
	overrideExisting: false,
});

export const {
	useNotificationsQuery,
	useDeleteNotificationMutation,
} = notificationsApi;
