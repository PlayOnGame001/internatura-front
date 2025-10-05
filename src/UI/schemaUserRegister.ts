import { z } from "zod";

export const userRegisterSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters long.")
		.max(10, "Username must not exceed 10 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"The username can only contain letters, numbers and underscores.",
		),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Invalid email address format",
		),
	password: z
		.string()
		.min(4, "The password must contain at least 4 characters.")
		.max(10, "The password must not exceed 10 characters.")
		.regex(/\d/, "The password must contain at least one number."),
});

export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;