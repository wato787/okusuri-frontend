import { z } from "zod";

export const registerNotificationSettingSchama = z.object({
	fcmToken: z.string(),
	isEnabled: z.boolean(),
	platform: z.enum(["ios", "android", "web"]),
});

export type RegisterNotificationSetting = z.infer<
	typeof registerNotificationSettingSchama
>;
