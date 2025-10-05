import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../UI";
import { loginUser } from "../data/Api/api";
import { userLoginSchema, type UserLoginFormData } from "../UI/userLogin.schema";

export default function LoginPage() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserLoginFormData>({
		resolver: zodResolver(userLoginSchema),
	});

	const onSubmit = async ({ email, password }: UserLoginFormData) => {
		try {
			const { token } = await loginUser(email, password);
			localStorage.setItem("token", token);
			navigate("/news");
		} catch (err: any) {
			alert(err.message || "Login failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-[800px] max-w-md h-[600px] bg-white p-8 rounded-lg shadow-lg space-y-6 flex flex-col">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">Login</h1>
					<p className="text-gray-600 mt-2">Log in to your account</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
						variant="primary"
						size="md"
						fullWidth
						className="mt-6"
					>
						Login
					</Button>
				</form>

				<div className="text-center">
					<p className="text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/reg"
							className="text-blue-600 hover:text-blue-700 font-medium"
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}