"use server";
import { authClient } from "./auth";

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: "/dashboard",
	});
};
