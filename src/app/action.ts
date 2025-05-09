"use server";

import { post } from "@/utils/apiBase";

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
