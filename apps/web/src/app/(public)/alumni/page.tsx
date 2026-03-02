'use client';

import Link from 'next/link';

import { useAuthStore } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlumniMember {
  id: string;
  username: string;
  name: string;
  batch: string;
  jobTitle: string;
  company: string;
  location: string;
  skills: string[];
  avatarInitials: string;
  // Contact info — shown only to authenticated members
  email: string;
  linkedin: string;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const ALUMNI: AlumniMember[] = [
  {
    id: '1',
    username: 'rakibul-islam',
    name: 'Md. Rakibul Islam',
    batch: 'Batch 2014',
    jobTitle: 'Chief Technology Officer',
    company: 'Paywell Technologies',
    location: 'Dhaka, Bangladesh',
    skills: ['Fintech', 'System Architecture', 'Node.js'],
    avatarInitials: 'RI',
    email: 'rakibul@example.com',
    linkedin: 'https://linkedin.com/in/rakibul-islam',
  },
  {
    id: '2',
    username: 'fahmida-akter',
    name: 'Fahmida Akter',
    batch: 'Batch 2016',
    jobTitle: 'Senior Software Engineer',
    company: 'Brain Station 23',
    location: 'Dhaka, Bangladesh',
    skills: ['React', 'TypeScript', 'AWS'],
    avatarInitials: 'FA',
    email: 'fahmida@example.com',
    linkedin: 'https://linkedin.com/in/fahmida-akter',
  },
  {
    id: '3',
    username: 'tanvir-hossain',
    name: 'Tanvir Hossain',
    batch: 'Batch 2017',
    jobTitle: 'ML Engineer',
    company: 'DataSoft Systems',
    location: 'Dhaka, Bangladesh',
    skills: ['Python', 'Machine Learning', 'Data Science'],
    avatarInitials: 'TH',
    email: 'tanvir@example.com',
    linkedin: 'https://linkedin.com/in/tanvir-hossain',
  },
  {
    id: '4',
    username: 'nusrat-jahan',
    name: 'Nusrat Jahan',
    batch: 'Batch 2018',
    jobTitle: 'Full Stack Developer',
    company: 'Kaz Software',
    location: 'Chittagong, Bangladesh',
    skills: ['Vue.js', 'Laravel', 'PostgreSQL'],
    avatarInitials: 'NJ',
    email: 'nusrat@example.com',
    linkedin: 'https://linkedin.com/in/nusrat-jahan',
  },
  {
    id: '5',
    username: 'arif-ahmed',
    name: 'Arif Ahmed',
    batch: 'Batch 2015',
    jobTitle: 'DevOps Engineer',
    company: 'BJIT Group',
    location: 'Dhaka, Bangladesh',
    skills: ['Kubernetes', 'Docker', 'CI/CD'],
    avatarInitials: 'AA',
    email: 'arif@example.com',
    linkedin: 'https://linkedin.com/in/arif-ahmed',
  },
  {
    id: '6',
    username: 'sadia-sultana',
    name: 'Sadia Sultana',
    batch: 'Batch 2019',
    jobTitle: 'Android Developer',
    company: 'Robi Axiata',
    location: 'Dhaka, Bangladesh',
    skills: ['Kotlin', 'Java', 'Firebase'],
    avatarInitials: 'SS',
    email: 'sadia@example.com',
    linkedin: 'https://linkedin.com/in/sadia-sultana',
  },
];

// ─── Guest contact banner ─────────────────────────────────────────────────────

function GuestContactBanner() {
  return (
    <div className="mb-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
      <svg
        className="mt-0.5 w-4 h-4 text-blue-600 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm text-blue-800">
        Contact details (email, LinkedIn) are visible to approved members only.{' '}
        <Link href="/auth/login" className="font-semibold underline hover:text-blue-900">
          Sign in
        </Link>{' '}
        or{' '}
        <Link href="/auth/register" className="font-semibold underline hover:text-blue-900">
          apply for membership
        </Link>{' '}
        to view them.
      </p>
    </div>
  );
}

// ─── Alumni card ──────────────────────────────────────────────────────────────

interface AlumniCardProps {
  member: AlumniMember;
  isAuthenticated: boolean;
}

function AlumniCard({ member, isAuthenticated }: AlumniCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all flex flex-col gap-4">
      {/* Public info — visible to everyone */}
      <Link href={`/alumni/${member.username}`} className="flex items-start gap-4 group">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center select-none">
          {member.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
            {member.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {member.jobTitle} · {member.company}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{member.location}</p>
        </div>
      </Link>

      {/* Skills & batch */}
      <div className="flex flex-wrap gap-1.5">
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium">
          {member.batch}
        </span>
        {member.skills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Contact info — members only */}
      <div className="border-t border-gray-100 pt-3">
        {isAuthenticated ? (
          <div className="flex flex-col gap-1.5">
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-700 transition-colors truncate"
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {member.email}
            </a>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-700 transition-colors truncate"
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn profile
            </a>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="italic">Sign in to view contact info</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Alumni Directory Page ────────────────────────────────────────────────────

export default function AlumniDirectoryPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = Boolean(accessToken);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Alumni Directory
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Browse graduates of the CSE Department, Dhaka International University. Connect with
              fellow alumni and explore career journeys across the community.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner for guests explaining contact-info gate */}
        {!isAuthenticated && <GuestContactBanner />}

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by name, company, or skill…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search alumni"
            />
          </div>
          <select
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by batch"
            defaultValue=""
          >
            <option value="">All batches</option>
            <option value="2014">Batch 2014</option>
            <option value="2015">Batch 2015</option>
            <option value="2016">Batch 2016</option>
            <option value="2017">Batch 2017</option>
            <option value="2018">Batch 2018</option>
            <option value="2019">Batch 2019</option>
          </select>
          <select
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by industry"
            defaultValue=""
          >
            <option value="">All industries</option>
            <option value="fintech">Fintech</option>
            <option value="software">Software Development</option>
            <option value="data">Data & AI</option>
            <option value="devops">DevOps & Cloud</option>
            <option value="mobile">Mobile Development</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="font-medium text-gray-900">{ALUMNI.length}</span> members
        </p>

        {/* Grid — always shown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALUMNI.map((member) => (
            <AlumniCard key={member.id} member={member} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      </div>
    </div>
  );
}
