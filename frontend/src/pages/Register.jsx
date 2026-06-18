import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import useFeedback from '../hooks/useFeedback';
import FeedbackAlert from '../components/FeedbackAlert';

function Register() {
  const navigate = useNavigate();
  const registerFeedback = useFeedback(4000);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    registerFeedback.clearFeedback();

    if (form.password !== form.confirmPassword) {
      registerFeedback.showError('Passwords do not match.')
      return;
    }

    if (form.password.length < 6) {
      registerFeedback.showError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
     
      await api.post('/api/auth/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      registerFeedback.showSuccess('Account created successfully. Redirecting to login...');
      

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      registerFeedback.showError(error.response?.data?.message || 'Registration failed. Please try again.');
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-xl lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Create account
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Join Junub Hire
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Create your account to apply for jobs and build your professional profile.
          </p>

          <FeedbackAlert feedback={registerFeedback.feedback}/>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repeat your password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden bg-gradient-to-br from-slate-950 to-blue-700 p-10 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
            Career growth
          </p>

          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Build your profile and apply with confidence.
          </h1>

          <p className="mt-4 text-blue-100">
            Save your details, prepare your resume, and manage your job applications in one place.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Professional profile</p>
              <p className="mt-1 text-sm text-blue-100">Keep your information ready for applications.</p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Resume builder</p>
              <p className="mt-1 text-sm text-blue-100">Create and update your resume anytime.</p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Application tracking</p>
              <p className="mt-1 text-sm text-blue-100">Monitor your submitted job applications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;