import { useState } from 'react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';
import useFeedback from '../hooks/useFeedback';
import FeedbackAlert from '../components/FeedbackAlert';

function Profile() {
  const { user, updateUser } = useAuth();
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === 'true';
  const profileFeedback = useFeedback(3000);
  const passwordFeedback = useFeedback(4000);
  
  const [profileForm, setProfileForm] = useState(() => ({
    name: user?.name || '',
  }));

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    profileFeedback.clearFeedback();

    if (disableAuth) {
      profileFeedback.showError(
        'Profile editing is disabled while VITE_DISABLE_AUTH is true.'
      );
      return;
    }

    if (!profileForm.name.trim()) {
      profileFeedback.showError('Username cannot be empty.');
      return;
    }

    try {
      setLoadingProfile(true);

      const res = await api.put('/api/auth/profile', {
        name: profileForm.name.trim(),
      });

      updateUser(res.data.user);

      setProfileForm({
        name: res.data.user.name || '',
      });

      profileFeedback.showSuccess(
        res.data.message || 'Username updated successfully.'
      );
    } catch (error) {
      profileFeedback.showError(
        error.response?.data?.message || 'Failed to update username.'
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    passwordFeedback.clearFeedback();

    if (disableAuth) {
      passwordFeedback.showError(
        'Password changing is disabled while VITE_DISABLE_AUTH is true.'
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      passwordFeedback.showError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      passwordFeedback.showError(
        'New password must be at least 6 characters.'
      );
      return;
    }

    try {
      setLoadingPassword(true);
     

      const res = await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      passwordFeedback.showSuccess(
        res.data.message || 'Password changed successfully.'
      );

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      passwordFeedback.showError(
        error.response?.data?.message || 'Failed to change password.'
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] bg-gradient-to-br from-blue-700 to-slate-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
            My Profile
          </p>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {user?.name || 'Your profile'}
              </h1>
              <p className="mt-2 text-blue-100">
                Manage your account information and security settings.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm text-blue-100">Account role</p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {user?.role || 'user'}
              </p>
            </div>
          </div>
        </div>

        {disableAuth && (
          <div className="mt-6 rounded-3xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
            You are currently using development auth mode. To test profile
            updates properly, set
            <span className="font-semibold"> VITE_DISABLE_AUTH=false </span>
            in your frontend .env and
            <span className="font-semibold"> DISABLE_AUTH=false </span>
            in your backend .env.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-[32px] bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">
              Account details
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Update your username. Your email address cannot be changed from
              profile settings.
            </p>

            <FeedbackAlert feedback={profileFeedback.feedback} />

            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Email cannot be changed from profile settings.
                </p>
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingProfile ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </section>

          <section className="rounded-[32px] bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">
              Change password
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Use a strong password with at least 6 characters.
            </p>

            <FeedbackAlert feedback={passwordFeedback.feedback} />

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Current password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Confirm new password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingPassword ? 'Updating...' : 'Change password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
