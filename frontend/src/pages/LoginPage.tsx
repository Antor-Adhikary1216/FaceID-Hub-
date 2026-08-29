import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth.store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, firebaseLogin } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await firebaseLogin();
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white dark:bg-surface-800">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <img
              src="/assets/images/FaceID_Hub_logo_design_2K_202608291407.jpeg"
              alt="FaceID Hub Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-[#0f172a] dark:text-white">FaceID Hub</span>
          </Link>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#0f172a] dark:text-white">Welcome back</h1>
          <p className="mt-2 text-[#64748b] dark:text-surface-400">Log in to your account to continue</p>

          {/* Form */}
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0f172a] dark:text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] dark:border-surface-600 text-[#0f172a] dark:text-white placeholder-[#94a3b8] dark:placeholder-surface-500 bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-[#1a7a5c] dark:focus:ring-primary-500 focus:border-transparent transition-colors pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-surface-500 hover:text-[#64748b] dark:hover:text-surface-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#e2e8f0] dark:border-surface-600 text-[#1a7a5c] dark:text-primary-500 focus:ring-[#1a7a5c] dark:focus:ring-primary-500"
                  {...register("rememberMe")}
                />
                <span className="text-sm text-[#64748b] dark:text-surface-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#1a7a5c] dark:text-primary-400 hover:text-[#15644a] dark:hover:text-primary-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#1a7a5c] dark:bg-primary-500 text-white font-semibold rounded-lg hover:bg-[#15644a] dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-[#1a7a5c] dark:focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0] dark:border-surface-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-surface-800 text-[#94a3b8] dark:text-surface-400">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e2e8f0] dark:border-surface-600 rounded-lg text-[#0f172a] dark:text-white hover:bg-[#f8fafc] dark:hover:bg-surface-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e2e8f0] dark:border-surface-600 rounded-lg text-[#0f172a] dark:text-white hover:bg-[#f8fafc] dark:hover:bg-surface-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-[#64748b] dark:text-surface-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#1a7a5c] dark:text-primary-400 hover:text-[#15644a] dark:hover:text-primary-300 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Green Gradient (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0f5c42] via-[#1a7a5c] to-[#15644a] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[10%] left-[10%] w-[200px] h-[200px] rounded-full bg-white/5" />
        <div className="absolute bottom-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-white/5" />

        <div className="relative z-10 max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">Privacy-First Identity</h2>
          <p className="text-[#d1f5e8] text-lg mb-8">
            Discover and connect with professionals while maintaining complete control over your personal data and biometric information.
          </p>

          {/* Quote Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <svg className="w-8 h-8 text-white/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
            </svg>
            <p className="text-white/90 italic">
              "The platform gives me full control over who can find me using my photo. I love the transparency and consent-first approach."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold">JD</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Jane Doe</p>
                <p className="text-xs text-white/60">Privacy Advocate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
