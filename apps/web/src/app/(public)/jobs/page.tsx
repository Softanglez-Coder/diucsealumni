import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Job Board — CSE DIU Alumni',
  description:
    'Discover tech jobs posted by and for the CSE DIU Alumni community. Browse full-time, part-time, remote, and internship opportunities.',
  openGraph: {
    title: 'Job Board — CSE DIU Alumni',
    description: 'Tech jobs posted by and for the CSE DIU Alumni community.',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: 'remote' | 'on-site' | 'hybrid';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  industry: string;
  description: string;
  postedBy: string;
  postedAt: string;
  expiresAt: string;
  applicationUrl: string;
  salary?: string;
  isFeatured?: boolean;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer — Backend',
    company: 'Pathao',
    location: 'Dhaka, Bangladesh',
    locationType: 'hybrid',
    jobType: 'full-time',
    industry: 'Tech / Ride-sharing',
    description:
      "Pathao is looking for a Senior Backend Engineer to work on our core logistics platform. You'll design scalable APIs, mentor junior engineers, and collaborate with product teams.",
    postedBy: 'Alumni (Batch 2015)',
    postedAt: 'Feb 27, 2025',
    expiresAt: 'Mar 27, 2025',
    applicationUrl: '#',
    salary: 'BDT 80,000–120,000/month',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Frontend Developer — React',
    company: 'ShopUp',
    location: 'Dhaka, Bangladesh',
    locationType: 'on-site',
    jobType: 'full-time',
    industry: 'E-commerce',
    description:
      "Build and maintain high-quality web applications for ShopUp's merchant dashboard. Strong React and TypeScript knowledge required.",
    postedBy: 'Alumni (Batch 2017)',
    postedAt: 'Feb 25, 2025',
    expiresAt: 'Mar 25, 2025',
    applicationUrl: '#',
    salary: 'BDT 50,000–75,000/month',
  },
  {
    id: '3',
    title: 'Machine Learning Engineer',
    company: 'Brain Station 23',
    location: 'Dhaka, Bangladesh',
    locationType: 'hybrid',
    jobType: 'full-time',
    industry: 'Software & Consulting',
    description:
      'Work on production ML pipelines for international clients. Experience with Python, TensorFlow or PyTorch, and MLOps tooling required.',
    postedBy: 'Admin Team',
    postedAt: 'Feb 22, 2025',
    expiresAt: 'Mar 22, 2025',
    applicationUrl: '#',
    salary: 'Negotiable',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Kona Software Lab',
    location: 'Remote (Bangladesh)',
    locationType: 'remote',
    jobType: 'full-time',
    industry: 'Fintech',
    description:
      'Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS. Experience with Docker, Terraform, and GitHub Actions preferred.',
    postedBy: 'Alumni (Batch 2016)',
    postedAt: 'Feb 20, 2025',
    expiresAt: 'Mar 20, 2025',
    applicationUrl: '#',
    salary: 'BDT 70,000–100,000/month',
  },
  {
    id: '5',
    title: 'Software Engineering Intern',
    company: 'SSL Wireless',
    location: 'Dhaka, Bangladesh',
    locationType: 'on-site',
    jobType: 'internship',
    industry: 'Telecom / IT',
    description:
      "Join the engineering team for a 3-month internship. You'll work on real features, participate in code reviews, and learn from senior engineers.",
    postedBy: 'Admin Team',
    postedAt: 'Feb 18, 2025',
    expiresAt: 'Mar 10, 2025',
    applicationUrl: '#',
    salary: 'BDT 10,000–15,000/month stipend',
  },
  {
    id: '6',
    title: 'Technical Product Manager',
    company: 'bKash',
    location: 'Dhaka, Bangladesh',
    locationType: 'hybrid',
    jobType: 'full-time',
    industry: 'Fintech / MFS',
    description:
      "Lead the product roadmap for bKash's merchant payment APIs. Requires technical background and experience working with engineering and business teams.",
    postedBy: 'Alumni (Batch 2014)',
    postedAt: 'Feb 15, 2025',
    expiresAt: 'Mar 15, 2025',
    applicationUrl: '#',
    salary: 'BDT 100,000–150,000/month',
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

type LocationType = JobPosting['locationType'];
type JobType = JobPosting['jobType'];

const LOCATION_STYLES: Record<LocationType, string> = {
  remote: 'bg-green-100 text-green-700',
  'on-site': 'bg-gray-100 text-gray-700',
  hybrid: 'bg-purple-100 text-purple-700',
};
const LOCATION_LABELS: Record<LocationType, string> = {
  remote: 'Remote',
  'on-site': 'On-site',
  hybrid: 'Hybrid',
};
const JOB_TYPE_STYLES: Record<JobType, string> = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-amber-100 text-amber-700',
  contract: 'bg-orange-100 text-orange-700',
  internship: 'bg-teal-100 text-teal-700',
};
const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

function JobCard({ job }: { job: JobPosting }) {
  return (
    <article className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Company initials avatar */}
      <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm select-none">
        {job.company.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Title + badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {job.isFeatured && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2.5 py-0.5">
                Featured
              </span>
            )}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${JOB_TYPE_STYLES[job.jobType]}`}
            >
              {JOB_TYPE_LABELS[job.jobType]}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LOCATION_STYLES[job.locationType]}`}
            >
              {LOCATION_LABELS[job.locationType]}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            {job.company} · {job.location}
          </p>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
          {job.salary && (
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {job.salary}
            </span>
          )}
          <span>Posted {job.postedAt}</span>
          <span>Expires {job.expiresAt}</span>
          <span>By {job.postedBy}</span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col justify-center">
        <Link
          href={`/auth/login?next=/jobs/${job.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap"
        >
          Apply — Sign in
        </Link>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const featured = JOBS.filter((j) => j.isFeatured);
  const rest = JOBS.filter((j) => !j.isFeatured);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-blue-100 mb-5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Alumni Job Board
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Opportunities from our network
          </h1>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Jobs posted by alumni and companies that trust CSE DIU graduates. Sign in to apply or
            post your own opening.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm shadow-lg hover:bg-blue-50 transition-colors"
            >
              Sign in to apply
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Apply for membership
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <dl className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center">
            {[
              { value: `${JOBS.length}`, label: 'Active listings' },
              { value: '300+', label: 'Placements to date' },
              { value: '40+', label: 'Partner companies' },
            ].map(({ value, label }) => (
              <div key={label}>
                <dt className="text-2xl font-bold text-blue-700">{value}</dt>
                <dd className="text-xs text-gray-500 mt-0.5">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Full-time', 'Part-time', 'Internship', 'Remote', 'On-site', 'Hybrid'].map(
            (f, idx) => (
              <span
                key={f}
                className={`cursor-default inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  idx === 0
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {f}
              </span>
            ),
          )}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Featured listings</h2>
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </section>
        )}

        {/* All listings */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            All listings
            <span className="ml-2 text-sm font-normal text-gray-400">({rest.length})</span>
          </h2>
          {rest.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>

        {/* Post a job CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 px-8 py-10 text-center">
          <h2 className="text-lg font-bold text-gray-900">Hiring CSE graduates?</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Sign in and post a job to reach 1,200+ alumni from the CSE department of DIU. All
            postings are reviewed before publishing.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Sign in to post a job
          </Link>
        </section>
      </div>
    </>
  );
}
