import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/services/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setIsSubmitted(true);
      toast.success("Reset link sent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-surface-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 mx-auto justify-center">
          <img
            src="/assets/images/FaceID_Hub_logo_design_2K_202608291407.jpeg"
            alt="FaceID Hub Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-2xl font-bold text-[#0f172a] dark:text-white">FaceID Hub</span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-surface-600 p-8">
          {isSubmitted ? (
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-[#0f172a] dark:text-white">Check your email</h2>
              <p className="mt-2 text-[#64748b] dark:text-surface-400">
                We've sent a password reset link to your email address. Please
                check your inbox and follow the instructions.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center text-[#1a7a5c] dark:text-primary-400 hover:text-[#15644a] dark:hover:text-primary-300 font-semibold"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white text-center">Reset your password</h1>
              <p className="mt-2 text-[#64748b] dark:text-surface-400 text-center">
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] dark:text-white mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] dark:border-surface-600 text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-surface-500 bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-[#1a7a5c] dark:focus:ring-primary-500 focus:border-transparent transition-colors"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#1a7a5c] dark:bg-primary-500 text-white font-semibold rounded-lg hover:bg-[#15644a] dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-[#1a7a5c] dark:focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
        {!isSubmitted && (
          <p className="mt-6 text-center text-sm text-[#64748b] dark:text-surface-400">
            <Link
              to="/login"
              className="text-[#1a7a5c] dark:text-primary-400 hover:text-[#15644a] dark:hover:text-primary-300 font-semibold inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
