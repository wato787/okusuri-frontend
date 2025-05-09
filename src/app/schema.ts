import { z } from "zod";

export const registerNotificationSettingSchama = z.object({
	fcmToken: z.string(),
	isEnabled: z.boolean(),
	platform: z.enum(["ios", "android", "web"]),
});

export type RegisterNotificationSetting = z.infer<
	typeof registerNotificationSettingSchama
>;

const notificationSettingSchema = z.object({
	id: z.string(),
	userId: z.string(),
	isEnabled: z.boolean(),
	fcmToken: z.string(),
	platform: z.enum(["ios", "android", "web"]),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type NotificationSetting = z.infer<typeof notificationSettingSchema>;
