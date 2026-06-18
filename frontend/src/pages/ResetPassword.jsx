import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import useFeedback from "../hooks/useFeedback";
import FeedbackAlert from "../components/FeedbackAlert";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const resetFeedback = useFeedback(4000);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    resetFeedback.clearFeedback();

    if (password !== confirmPassword) {
      resetFeedback.showError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      resetFeedback.showError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.put(`/api/auth/reset-password/${token}`, {
        password,
      });

      resetFeedback.showSuccess(res.data.message);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      resetFeedback.showError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
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
            Create a new secure password.
          </h1>

          <p className="mt-4 text-blue-100">
            Choose a new password for your CareerHub account and return to your
            dashboard.
          </p>

          <div className="mt-10 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-blue-100">Password security</p>
            <p className="mt-3 text-2xl font-semibold">
              Use at least 6 characters.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Reset password
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Set new password
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Enter and confirm your new password below.
          </p>

          <FeedbackAlert feedback={resetFeedback.feedback} className="mt-6"/>

          <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                New password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Confirm password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Want to login instead?{" "}
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

export default ResetPassword;