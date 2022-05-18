import { DataListType } from "./common";
import { UserInfoType } from "./user";

export type NotificationType = {
	id: string | number;
	_type: "L";
	sender: UserInfoType;
	recipient: UserInfoType;
	message: string;
	message_id: number;
	read: boolean;
	date_sent: string;
}

export interface GetNotificationsDataType extends DataListType {
	results: NotificationType[];
	unread_count: number;
}