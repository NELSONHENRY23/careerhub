import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

import useFeedback from "../hooks/useFeedback";
import FeedbackAlert from "../components/Feedback";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotFeedback = useFeedback(4000);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    forgotFeedback.clearFeedback();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      forgotFeedback.showSuccess(res.data.message);
      setEmail("");
    } catch (error) {
      forgotFeedback.showError(
           error.response?.data?.message ||
             "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-700 to-slate-950 p-10 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
            Junub Hire
          </p>

          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Recover your CareerHub account.
          </h1>

          <p className="mt-4 text-blue-100">
            Enter your email address and we will send you a secure password
            reset link.
          </p>

          <div className="mt-10 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-blue-100">Secure account recovery</p>
            <p className="mt-3 text-2xl font-semibold">
              Reset your password and continue applying.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Forgot password
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Reset your password
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Enter the email linked to your account. If the account exists, a
            password reset link will be sent.
          </p>

          <FeedbackAlert feedback={forgotFeedback.feedback} className="mt-6"/>

          <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending reset link..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;