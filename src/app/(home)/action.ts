"use server";

import { post } from "@/utils/apiBase";
import { revalidateTag } from "next/cache";

export const registerMedicationLog = async (req: {
	hasBleeding: boolean;
}) => {
	const res = await post("/medication-log", req);
	if (res.status !== 200) {
		return {
			success: false,
		};
	}

	revalidateTag("medication-log");
	return {
		success: true,
	};
};
