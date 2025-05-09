import { get } from "@/utils/apiBase";
import type { MedicationLog } from "./schema";

/**
 * 服薬ログの取得
 */
export const getMedicationLog = async () => {
	const res = await get<MedicationLog[]>("/medication-log");
	if (res.status !== 200) {
		return undefined;
	}
	return res.data;
};
