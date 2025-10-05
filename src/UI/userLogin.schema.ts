import { z } from "zod";

export const userLoginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(4, "The password must contain at least 4 characters."),
});

export type UserLoginFormData = z.infer<typeof userLoginSchema>;