"use server";

import { post, patch } from "@/utils/apiBase";
import { revalidateTag } from "next/cache";

// 服薬ログ登録処理
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
	revalidateTag("medication-status"); // 服薬ステータスも更新
	return {
		success: true,
	};
};

// 服薬ログ更新処理
export const updateMedicationLog = async (id: string, req: {
	hasBleeding: boolean;
}) => {
	const res = await patch(`/medication-log/${id}`, req);
	if (res.status !== 200) {
		return {
			success: false,
		};
	}

	revalidateTag("medication-log");
	revalidateTag("medication-status"); // 服薬ステータスも更新
	return {
		success: true,
	};
};
