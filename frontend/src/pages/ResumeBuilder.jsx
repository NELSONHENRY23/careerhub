import { useState } from 'react';
import ResumeBuilderModal from '../components/ResumeBuilderModal';

function ResumeBuilder() {
  const [showResumeModal, setShowResumeModal] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-[40px] bg-white p-10 shadow-xl">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Resume Builder
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Build a resume that stands out.
            </h1>
            <p className="text-sm leading-7 text-slate-600">
              Use our step-by-step resume builder to create a polished resume and
              get noticed by employers.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Easy templates
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Choose from clean, professional resume layouts designed for
                hiring managers.
              </p>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Smart sections
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Get guidance for each section, from experience to skills and
                education.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-[32px] bg-blue-600 p-8 text-white shadow-lg">
            <h2 className="text-2xl font-semibold">Get started now</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              Save your resume and use it for multiple job applications with
              confidence.
            </p>
            <button
              type="button"
              onClick={() => setShowResumeModal(true)}
              className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-slate-100"
            >
              Start Building
            </button>
          </div>
        </div>
      </div>

      <ResumeBuilderModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </div>
  );
}

export default ResumeBuilder;
