import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
    <Link
      to="/"
      className="flex items-center gap-3 text-2xl font-bold text-slate-900"
    >
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
        <span className="text-lg font-extrabold">JH</span>
        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
      </span>

      <span>
        Junub<span className="text-blue-600">Hire</span>
      </span>
    </Link>

    <div className="hidden items-center gap-6 font-medium text-slate-700 md:flex">
      <Link to="/" className="hover:text-blue-600">
        Home
      </Link>

      <Link to="/jobs" className="hover:text-blue-600">
        Find Jobs
      </Link>

      <Link to="/resume-builder" className="hover:text-blue-600">
        Resume Builder
      </Link>

      <Link to="/#contact" className="hover:text-blue-600">
        Contact
      </Link>

      <Link to="/#blog" className="hover:text-blue-600">
        Blog
      </Link>

      <Link to="/#about" className="hover:text-blue-600">
        About
      </Link>

      {isAdmin && (
        <Link
          to="/post-job"
          className="rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Post A Job
        </Link>
      )}

      {token ? (
        <>
          <Link
            to="/dashboard"
            className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
          >
            Dashboard
          </Link>

          {!isAdmin && (
            <Link
              to="/my-applications"
              className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
            >
              My Applications
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>

    <button
      type="button"
      className="text-slate-700 md:hidden"
      onClick={() => setOpen(!open)}
      aria-label="Toggle navigation"
    >
      ☰
    </button>
  </div>

  {open && (
    <div className="flex flex-col gap-2 border-t border-slate-200 bg-white px-4 pb-4 pt-2 text-slate-700 md:hidden">
      <Link
        to="/"
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 hover:bg-slate-100"
      >
        Home
      </Link>

      <Link
        to="/jobs"
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 hover:bg-slate-100"
      >
        Find Jobs
      </Link>

      <Link
        to="/resume-builder"
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 hover:bg-slate-100"
      >
        Resume Builder
      </Link>

      <Link
        to="/#contact"
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 hover:bg-slate-100"
      >
        Contact
      </Link>

      <Link
        to="/#blog"
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 hover:bg-slate-100"
      >
        Blog
      </Link>

      <Link
        to="/#about"
        onClick={() => setOpen(false)}
        className="block rounded-md px-3 py-2 hover:bg-slate-100"
      >
        About
      </Link>

      {isAdmin && (
        <Link
          to="/post-job"
          onClick={() => setOpen(false)}
          className="block rounded-md px-3 py-2 hover:bg-slate-100"
        >
          Post A Job
        </Link>
      )}

      {token ? (
        <>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            Dashboard
          </Link>

          {!isAdmin && (
            <Link
              to="/my-applications"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              My Applications
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-left hover:bg-slate-100"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            Log In
          </Link>

          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  )}
</nav>
  );
}

export default Navbar;
