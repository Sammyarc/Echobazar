import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});

	const isProduction = process.env.NODE_ENV === "production";

	res.cookie("token", token, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
		maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
	});

	return token;
};
