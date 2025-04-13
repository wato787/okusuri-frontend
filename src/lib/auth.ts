import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { Pool } from "pg";

export const auth = betterAuth({
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
});

const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
	});
	console.log("data", data);
	return data;
};
