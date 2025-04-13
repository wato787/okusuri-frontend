import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/client";

export const auth = betterAuth({
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});

const authClient = createAuthClient();

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
	});
	console.log("data", data);
	return data;
};
