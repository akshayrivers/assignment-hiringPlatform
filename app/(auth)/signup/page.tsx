"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Simple Zod schema for sign up
const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [userType, setUserType] = useState<"recruiter" | "candidate">(
    "recruiter"
  );
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const endpoint =
      userType === "recruiter"
        ? "/api/signup/recruiter"
        : "/api/signup/candidate";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!result.success) {
      setError(result.message || "Sign up failed");
    } else {
      router.push("/signin"); // after signup we make the user sign in again
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="mb-4 text-2xl font-bold text-center">Sign Up</h1>
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
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
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
            Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
