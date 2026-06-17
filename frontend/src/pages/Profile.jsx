import { useState } from 'react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

function Profile() {
  const { user, updateUser } = useAuth();
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === 'true';

  const [profileForm, setProfileForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
  }));

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [profileMessageType, setProfileMessageType] = useState('');

  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState('');


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
  
    if (disableAuth) {
      setProfileMessage('Profile editing is disabled while VITE_DISABLE_AUTH is true.');
      setProfileMessageType('error');
      return;
    }
  
    try {
      setLoadingProfile(true);
      setProfileMessage('');
      setProfileMessageType('');
  
      const res = await api.put('/api/auth/profile', {
        name: profileForm.name.trim(),
        email: profileForm.email.trim().toLowerCase(),
      });
  
      updateUser(res.data.user);
  
      setProfileForm({
        name: res.data.user.name || '',
        email: res.data.user.email || '',
      });
  
      setProfileMessage(res.data.message || 'Profile updated successfully.');
      setProfileMessageType('success');
    } catch (error) {
      setProfileMessage(error.response?.data?.message || 'Failed to update profile.');
      setProfileMessageType('error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (disableAuth) {
      setPasswordMessage('Password changing is disabled while VITE_DISABLE_AUTH is true.');
      setPasswordMessageType('error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      setPasswordMessageType('error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters.');
      setPasswordMessageType('error');
      return;
    }

    try {
      setLoadingPassword(true);
      setPasswordMessage('');
      setPasswordMessageType('');

      const res = await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordMessage(res.data.message || 'Password changed successfully.');
      setPasswordMessageType('success');

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Failed to change password.');
      setPasswordMessageType('error');
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
            You are currently using development auth mode. To test profile updates properly, set
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
              Update your name and email address.
            </p>

            {profileMessage && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                  profileMessageType === 'success'
                    ? 'border border-green-200 bg-green-50 text-green-700'
                    : 'border border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {profileMessage}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Full name
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
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
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

            {passwordMessage && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                  passwordMessageType === 'success'
                    ? 'border border-green-200 bg-green-50 text-green-700'
                    : 'border border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {passwordMessage}
              </div>
            )}

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