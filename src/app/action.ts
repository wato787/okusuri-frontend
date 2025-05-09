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
		return {
			success: false,
		};
	}
	return {
		success: true,
	};
};

export const registerMedicationLog = async (req: {
	hasBleeding: boolean;
}) => {
	const res = await post("/medication-log", req);
	if (res.status !== 200) {
		return {
			success: false,
		};
	}
	return {
		success: true,
	};
};
