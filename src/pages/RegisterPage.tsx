import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../UI";
import { registerUser } from "../data/Api/api";
import { userRegisterSchema, type UserRegisterFormData } from "../UI/schemaUserRegister";

export default function RegisterPage() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserRegisterFormData>({
		resolver: zodResolver(userRegisterSchema),
	});

	const onSubmit = async ({ email, username, password }: UserRegisterFormData) => {
		try {
			await registerUser(email, username, password);
			alert("✅ Registered successfully!");
			navigate("/log");
		} catch (err: any) {
			alert(err.message || "Registration failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center ">
			<div className="w-[800px] max-w-md h-[600px] bg-white p-8 rounded-lg shadow-lg space-y-6 flex flex-col">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">Registration</h1>
					<p className="text-gray-600 mt-2">Create new account</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
					<Input
						{...register("username")}
						label="User name"
						placeholder="Enter your name"
						error={errors.username?.message}
					/>
					<Input
						{...register("email")}
						type="email"
						label="Email"
						placeholder="Enter your email"
						error={errors.email?.message}
					/>
					<Input
						{...register("password")}
						type="password"
						label="Password"
						placeholder="Enter password"
						error={errors.password?.message}
					/>
					<Button
						type="submit"
						variant="success"
						size="md"
						fullWidth
						className="mt-6"
					>
						Register
					</Button>
				</form>

				<div className="text-center">
					<p className="text-gray-600">
						Already have an account?{" "}
						<Link
							to="/log"
							className="text-blue-600 hover:text-blue-700 font-medium"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}