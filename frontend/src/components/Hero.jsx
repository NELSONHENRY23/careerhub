import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Build URL search params to pass to the jobs page.
    // This persists the search query and location in the URL for bookmarking and sharing.
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 pb-20 pt-16 sm:pb-24">
      <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-blue-100 opacity-70 blur-3xl"></div>
      <div className="absolute right-0 top-28 h-56 w-56 rounded-full bg-indigo-100 opacity-70 blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="relative z-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-blue-600">
              Jobify — find your next role
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Your <span className="text-blue-600">Dream Job</span> Here
              <span className="block text-slate-900">Easy & Fast</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Finding proper jobs in America can be tough. Jobify is a platform
              where you can get your desired job without any hassle and in less
              time.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-10 grid gap-4 rounded-3xl bg-white p-4 shadow-xl sm:grid-cols-[1.4fr_1fr]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search job title or keyword"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500"
                />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder="Search city or zipcode"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Trusted by over{' '}
              <span className="font-semibold text-slate-900">2800+</span>{' '}
              companies.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[40px] bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white">
                  💼
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Remote Roles
                  </p>
                  <p className="text-sm text-slate-500">
                    Top work-from-home positions.
                  </p>
                </div>
              </div>
              <p className="text-slate-600">
                Get access to remote-friendly companies and fully distributed
                teams.
              </p>
            </div>
            <div className="rounded-[40px] bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700">
                  🚀
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Fast Application
                  </p>
                  <p className="text-sm text-slate-500">
                    One-click job submission.
                  </p>
                </div>
              </div>
              <p className="text-slate-600">
                Fill your profile once and apply quickly to relevant jobs with
                confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
