"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.redirect) {
        if (rememberMe) {
          localStorage.setItem("remembered_username", username);
        } else {
          localStorage.removeItem("remembered_username");
        }
        router.push(result.redirect);
      }
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Left Section - Brand */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:rounded-r-[3rem] shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl font-bold">
                $
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Mynt Financial
              </span>
            </div>
            <div className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-xs font-semibold tracking-wide">
              SECURE PORTAL
            </div>
          </div>

          <div className="py-12 lg:py-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Welcome back
            </h1>
            <p className="text-lg text-white/80 mb-12 leading-relaxed">
              Access your financial dashboard with enterprise-grade security and
              real-time insights
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold group-hover:bg-white/20 transition-colors">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Bank-Level Security</h3>
                  <p className="text-sm text-white/70">
                    256-bit encryption protecting your data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold group-hover:bg-white/20 transition-colors">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                  <p className="text-sm text-white/70">
                    Instant access to financial insights
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold group-hover:bg-white/20 transition-colors">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-sm text-white/70">
                    Dedicated assistance when you need it
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/50 text-center lg:text-left">
            © 2026 Mynt Financial. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h2>
            <p className="text-slate-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 text-sm font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-700"
              >
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-100 shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-semibold">Demo Credentials</span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                <span className="font-medium text-slate-600">Admin:</span>
                <code className="text-blue-600 font-mono">
                  uni_admin / admin
                </code>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                <span className="font-medium text-slate-600">Bank:</span>
                <code className="text-blue-600 font-mono">
                  zanaco_admin / password
                </code>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                <span className="font-medium text-slate-600">Student:</span>
                <code className="text-blue-600 font-mono">
                  Alice / student_password
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
