"use server";

import { type BaseResponse, post } from "@/utils/apiBase";
import type { RegisterNotificationSetting } from "./schema";

export const registerNotificationSetting = async (
	req: RegisterNotificationSetting,
) => {
	const res = await post<RegisterNotificationSetting, BaseResponse>(
		"/notification/setting",
		req,
	);

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}
	return res.data;
};
