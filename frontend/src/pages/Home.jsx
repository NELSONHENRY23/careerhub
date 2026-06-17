import{Link} from 'react-router-dom';
import Hero from '../components/Hero';
import JobLists from '../components/JobLists';
import { jobCategories } from '../data/jobCategories';

// These cards are static UI examples to match the landing page design.
// The real job data is fetched from your backend via useJobs().

function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-16">
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Browse Popular Jobs
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Discover opportunities in the most in-demand categories.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              We have listed our top and demandable jobs according to our
              audience demand. Popular jobs may change depending on time and
              market.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {jobCategories.slice(0,4).map((category) => (
              <Link
                to={`/jobs?category=${encodeURIComponent(category.value)}`}
                key={category.title}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${category.accent}`}
                >
                  {category.jobs}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="space-y-6 rounded-[40px] bg-white p-8 shadow-xl"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                About Jobify
              </p>
              <h3 className="mt-4 text-3xl font-bold text-slate-900">
                Built to make the job search simple and modern.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Jobify helps job seekers find roles faster by combining powerful
                search with a clean, polished experience. Everything from
                browsing categories to viewing details is built for easy
                discovery.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-xl font-semibold text-slate-900">2800+</p>
                <p className="mt-2 text-sm text-slate-600">
                  Companies trust Jobify
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-xl font-semibold text-slate-900">14k</p>
                <p className="mt-2 text-sm text-slate-600">
                  Active roles this month
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="blog" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                Latest updates
              </p>
              <h3 className="mt-4 text-3xl font-bold text-slate-900">
                Insights for better career decisions
              </h3>
            </div>
            <Link to="/blog" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              View Blog
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">Career Tips</p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">
                How to position your resume for remote roles
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Learn the exact words hiring managers want to see when searching
                for distributed team talent.
              </p>
            </article>
            <article className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">
                Hiring Guide
              </p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">
                Top skills employers want in 2026
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Stay ahead with the most sought-after capabilities across
                software, healthcare, finance, and marketing.
              </p>
            </article>
            <article className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">Community</p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">
                Create a standout profile in minutes
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Get your profile ready for top recruiters with an easy
                step-by-step builder.
              </p>
            </article>
          </div>
        </section>

        <section
          id="contact"
          className="rounded-[40px] bg-blue-600 px-8 py-10 text-white shadow-xl sm:px-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
                Contact us
              </p>
              <h3 className="mt-4 text-3xl font-bold">
                Ready to get started? Let us help match you with the best
                openings.
              </h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-blue-100">
                Chat with our team or sign in to save your search and get
                tailored recommendations.
              </p>
              <Link to="/contact" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-slate-100">
                Contact Support
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Explore latest jobs
              </h2>
              <p className="text-sm text-slate-600">
                Browse the freshest postings that match your goals today.
              </p>
            </div>
            <Link to="/jobs" className="rounded-full bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              View all jobs
            
            </Link>
          </div>

          <JobLists />
        </section>
      </main>
    </div>
  );
}

export default Home;
