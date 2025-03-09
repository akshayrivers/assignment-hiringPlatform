"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

//we are using Zod for validation
const signInSchema = z.object({
  identifier: z.string().nonempty("Email or Username is required"),
  password: z.string().nonempty("Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"recruiter" | "candidate">(
    "recruiter"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    // Calling the NextAuth signIn function with the selected provider,
    const result = await signIn(userType, {
      redirect: false,
      email: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      setError("Login failed. Please check your credentials.");
    } else if (result?.url) {
      router.push("./dashboard"); // for now we just hardcode it
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="mb-4 text-2xl font-bold text-center">Sign In</h1>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setUserType("recruiter")}
            className={`px-4 py-2 ${
              userType === "recruiter"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } rounded-l`}
          >
            Recruiter
          </button>
          <button
            onClick={() => setUserType("candidate")}
            className={`px-4 py-2 ${
              userType === "candidate"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } rounded-r`}
          >
            Candidate
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email or Username</label>
            <input
              type="text"
              {...register("identifier")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
