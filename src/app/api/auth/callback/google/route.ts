export const GET = async (request: Request) => {
	const url = new URL(request.url);
	console.log("url", url);
	const { searchParams } = url;
	const code = searchParams.get("code");
	const state = searchParams.get("state");

	if (!code || !state) {
		return new Response("Missing code or state", { status: 400 });
	}

	const response = await fetch(
		`https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google&grant_type=authorization_code`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);

	if (!response.ok) {
		return new Response("Failed to exchange code for token", { status: 500 });
	}

	const data = await response.json();

	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});
};

export const dynamic = "force-dynamic";
