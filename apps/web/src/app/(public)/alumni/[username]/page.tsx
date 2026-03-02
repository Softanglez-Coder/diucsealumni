'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import { useAuthStore } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description: string;
  current: boolean;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
}

interface Achievement {
  year: string;
  title: string;
  description: string;
}

interface AlumniProfile {
  username: string;
  name: string;
  avatarInitials: string;
  batch: string;
  membershipTier: string;
  membershipNumber: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  skills: string[];
  // Social links — public
  linkedin: string;
  github: string;
  website: string;
  // Contact — members only
  email: string;
  // History
  experience: WorkExperience[];
  education: Education[];
  achievements: Achievement[];
  cvAvailable: boolean;
}

// ─── Placeholder profiles ─────────────────────────────────────────────────────

const PROFILES: Record<string, AlumniProfile> = {
  'rakibul-islam': {
    username: 'rakibul-islam',
    name: 'Md. Rakibul Islam',
    avatarInitials: 'RI',
    batch: 'Batch 2014',
    membershipTier: 'Life',
    membershipNumber: 'CSEDIA-LIF-2020-00003',
    jobTitle: 'Chief Technology Officer',
    company: 'Paywell Technologies',
    location: 'Dhaka, Bangladesh',
    bio: 'Software engineer turned tech leader with 10+ years of experience building fintech products at scale. Passionate about distributed systems, developer experience, and growing engineering teams. Proud graduate of CSE DIU, Batch 2014.',
    skills: [
      'Fintech',
      'System Architecture',
      'Node.js',
      'Microservices',
      'PostgreSQL',
      'Redis',
      'Kubernetes',
      'Team Leadership',
    ],
    linkedin: 'https://linkedin.com/in/rakibul-islam',
    github: 'https://github.com/rakibul-islam',
    website: 'https://rakibul.dev',
    email: 'rakibul@example.com',
    experience: [
      {
        title: 'Chief Technology Officer',
        company: 'Paywell Technologies',
        period: '2022 – Present',
        description:
          "Leading engineering org of 40+. Overseeing platform architecture, hiring, and technology strategy for one of Bangladesh's fastest-growing fintech companies.",
        current: true,
      },
      {
        title: 'VP Engineering',
        company: 'ShurjoPay',
        period: '2019 – 2022',
        description:
          'Built and scaled the payment gateway engineering team from 5 to 25 engineers. Drove the migration from monolith to microservices, reducing downtime by 80%.',
        current: false,
      },
      {
        title: 'Senior Backend Engineer',
        company: 'bKash Limited',
        period: '2016 – 2019',
        description:
          'Core platform engineer on the wallet transaction system processing millions of daily transactions.',
        current: false,
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Dhaka International University',
        period: '2010 – 2014',
      },
    ],
    achievements: [
      {
        year: '2024',
        title: 'Featured Alumni of the Year',
        description:
          'Recognised by the CSE Department for outstanding contributions to the fintech industry in Bangladesh.',
      },
      {
        year: '2023',
        title: 'Speaker — DevConBD',
        description:
          'Delivered a keynote on "Scaling Payments Infrastructure in Emerging Markets" at DevConBD 2023.',
      },
    ],
    cvAvailable: true,
  },
  'fahmida-akter': {
    username: 'fahmida-akter',
    name: 'Fahmida Akter',
    avatarInitials: 'FA',
    batch: 'Batch 2016',
    membershipTier: 'Regular',
    membershipNumber: 'CSEDIA-REG-2022-00047',
    jobTitle: 'Senior Software Engineer',
    company: 'Brain Station 23',
    location: 'Dhaka, Bangladesh',
    bio: 'Frontend-focused full-stack engineer specialising in React and TypeScript. I care deeply about accessibility, performance, and clean component APIs. Open source contributor and occasional blogger.',
    skills: ['React', 'TypeScript', 'Next.js', 'AWS', 'GraphQL', 'Accessibility', 'TailwindCSS'],
    linkedin: 'https://linkedin.com/in/fahmida-akter',
    github: 'https://github.com/fahmida-akter',
    website: '',
    email: 'fahmida@example.com',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Brain Station 23',
        period: '2021 – Present',
        description:
          'Lead frontend on a UK-based e-commerce platform serving 2M+ monthly active users. Introduced TypeScript and improved test coverage from 12% to 78%.',
        current: true,
      },
      {
        title: 'Software Engineer',
        company: 'Kona Software Lab',
        period: '2018 – 2021',
        description:
          'Worked on NFC-based loyalty and payment integrations for retail clients across Southeast Asia.',
        current: false,
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Dhaka International University',
        period: '2012 – 2016',
      },
    ],
    achievements: [
      {
        year: '2023',
        title: 'Open Source Contribution — React Aria',
        description:
          "Contributed accessibility fixes and documentation improvements to Adobe's React Aria library.",
      },
    ],
    cvAvailable: true,
  },
  'tanvir-hossain': {
    username: 'tanvir-hossain',
    name: 'Tanvir Hossain',
    avatarInitials: 'TH',
    batch: 'Batch 2017',
    membershipTier: 'Regular',
    membershipNumber: 'CSEDIA-REG-2023-00089',
    jobTitle: 'ML Engineer',
    company: 'DataSoft Systems',
    location: 'Dhaka, Bangladesh',
    bio: 'Machine learning engineer working on NLP and predictive analytics for government and enterprise clients. MSc researcher in deep learning. Always curious, always experimenting.',
    skills: [
      'Python',
      'Machine Learning',
      'Data Science',
      'NLP',
      'TensorFlow',
      'PyTorch',
      'SQL',
      'Docker',
    ],
    linkedin: 'https://linkedin.com/in/tanvir-hossain',
    github: 'https://github.com/tanvir-hossain',
    website: '',
    email: 'tanvir@example.com',
    experience: [
      {
        title: 'ML Engineer',
        company: 'DataSoft Systems',
        period: '2020 – Present',
        description:
          'Building NLP pipelines for Bengali document classification and entity extraction. Working closely with government agencies on digitalisation projects.',
        current: true,
      },
      {
        title: 'Junior Data Analyst',
        company: 'Therap (BD) Ltd.',
        period: '2018 – 2020',
        description:
          'Developed dashboards and automated reporting for US-based healthcare clients using Python and SQL.',
        current: false,
      },
    ],
    education: [
      {
        degree: 'M.Sc. in Computer Science (ongoing)',
        institution: 'Bangladesh University of Engineering and Technology',
        period: '2022 – Present',
      },
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Dhaka International University',
        period: '2013 – 2017',
      },
    ],
    achievements: [
      {
        year: '2022',
        title: 'Best Paper — ICCIT 2022',
        description:
          'Co-authored "Bengali Sentiment Analysis using Transformer Models" which received the Best Paper award at ICCIT 2022.',
      },
    ],
    cvAvailable: false,
  },
  'nusrat-jahan': {
    username: 'nusrat-jahan',
    name: 'Nusrat Jahan',
    avatarInitials: 'NJ',
    batch: 'Batch 2018',
    membershipTier: 'Regular',
    membershipNumber: 'CSEDIA-REG-2024-00112',
    jobTitle: 'Full Stack Developer',
    company: 'Kaz Software',
    location: 'Chittagong, Bangladesh',
    bio: 'Full stack developer who loves building products end-to-end. Comfortable across the entire stack from database schema design to pixel-perfect UIs. Side project enthusiast.',
    skills: ['Vue.js', 'Laravel', 'PostgreSQL', 'PHP', 'Docker', 'MySQL', 'REST APIs'],
    linkedin: 'https://linkedin.com/in/nusrat-jahan',
    github: 'https://github.com/nusrat-jahan',
    website: '',
    email: 'nusrat@example.com',
    experience: [
      {
        title: 'Full Stack Developer',
        company: 'Kaz Software',
        period: '2020 – Present',
        description:
          'Developing SaaS products for international clients in the logistics and supply chain domain.',
        current: true,
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Dhaka International University',
        period: '2014 – 2018',
      },
    ],
    achievements: [],
    cvAvailable: true,
  },
  'arif-ahmed': {
    username: 'arif-ahmed',
    name: 'Arif Ahmed',
    avatarInitials: 'AA',
    batch: 'Batch 2015',
    membershipTier: 'Regular',
    membershipNumber: 'CSEDIA-REG-2021-00028',
    jobTitle: 'DevOps Engineer',
    company: 'BJIT Group',
    location: 'Dhaka, Bangladesh',
    bio: 'DevOps and platform engineer focused on Kubernetes, CI/CD automation, and SRE practices. Believer in GitOps, Infrastructure as Code, and blameless post-mortems.',
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'AWS', 'Helm', 'Prometheus', 'Grafana'],
    linkedin: 'https://linkedin.com/in/arif-ahmed',
    github: 'https://github.com/arif-ahmed',
    website: '',
    email: 'arif@example.com',
    experience: [
      {
        title: 'DevOps Engineer',
        company: 'BJIT Group',
        period: '2019 – Present',
        description:
          'Maintaining cloud infrastructure for 30+ client projects on AWS. Introduced Terraform-based IaC, cutting provisioning time from days to minutes.',
        current: true,
      },
      {
        title: 'Systems Engineer',
        company: 'Ranks ITT',
        period: '2017 – 2019',
        description: 'Managing on-premise Linux server fleet and network infrastructure.',
        current: false,
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Dhaka International University',
        period: '2011 – 2015',
      },
    ],
    achievements: [],
    cvAvailable: false,
  },
  'sadia-sultana': {
    username: 'sadia-sultana',
    name: 'Sadia Sultana',
    avatarInitials: 'SS',
    batch: 'Batch 2019',
    membershipTier: 'Regular',
    membershipNumber: 'CSEDIA-REG-2025-00201',
    jobTitle: 'Android Developer',
    company: 'Robi Axiata',
    location: 'Dhaka, Bangladesh',
    bio: "Android developer passionate about building smooth, accessible mobile experiences. Currently working on Robi's consumer apps used by millions. Advocate for women in tech.",
    skills: [
      'Kotlin',
      'Java',
      'Android SDK',
      'Firebase',
      'Jetpack Compose',
      'REST APIs',
      'Clean Architecture',
    ],
    linkedin: 'https://linkedin.com/in/sadia-sultana',
    github: 'https://github.com/sadia-sultana',
    website: '',
    email: 'sadia@example.com',
    experience: [
      {
        title: 'Android Developer',
        company: 'Robi Axiata',
        period: '2021 – Present',
        description:
          'Developing and maintaining the My Robi app (5M+ downloads) and internal enterprise apps.',
        current: true,
      },
      {
        title: 'Junior Android Developer',
        company: 'Dohatec New Media',
        period: '2019 – 2021',
        description:
          'Built Android applications for e-government services and mobile banking clients.',
        current: false,
      },
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Dhaka International University',
        period: '2015 – 2019',
      },
    ],
    achievements: [
      {
        year: '2024',
        title: 'Women in Tech Award — BASIS',
        description:
          'Received the BASIS Women in Tech recognition for mentoring initiative within the Android developer community.',
      },
    ],
    cvAvailable: true,
  },
};

const TIER_STYLES: Record<string, string> = {
  Life: 'bg-amber-100 text-amber-800',
  Honorary: 'bg-purple-100 text-purple-800',
  Regular: 'bg-blue-50 text-blue-700',
};

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
      {children}
    </h2>
  );
}

// ─── Contact section ──────────────────────────────────────────────────────────

function ContactSection({
  profile,
  isAuthenticated,
}: {
  profile: AlumniProfile;
  isAuthenticated: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <SectionHeading>Contact</SectionHeading>

      {isAuthenticated ? (
        <div className="space-y-3">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Email</p>
              <p className="text-sm text-gray-700 truncate group-hover:text-blue-700">
                {profile.email}
              </p>
            </div>
          </a>

          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400">LinkedIn</p>
                <p className="text-sm text-blue-600 truncate">View profile</p>
              </div>
            </a>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
          <svg
            className="w-5 h-5 text-gray-300 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-xs text-gray-500 mb-3">
            Contact info is visible to approved members only.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-medium hover:bg-blue-800 transition-colors"
          >
            Sign in to view
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────

export default function AlumniProfilePage() {
  const params = useParams();
  const username = typeof params['username'] === 'string' ? params['username'] : '';
  const profile = PROFILES[username];

  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = Boolean(accessToken);

  if (!profile) {
    notFound();
  }

  const tierStyle = TIER_STYLES[profile.membershipTier] ?? TIER_STYLES['Regular'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Profile header ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <Link
            href="/alumni"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Alumni Directory
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center select-none">
              {profile.avatarInitials}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${tierStyle}`}>
                  {profile.membershipTier}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-1">
                {profile.jobTitle}
                {profile.company && (
                  <>
                    {' '}
                    · <span className="font-medium text-gray-800">{profile.company}</span>
                  </>
                )}
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profile.location}
                </span>
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
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                  {profile.batch}
                </span>
                <span className="font-mono">{profile.membershipNumber}</span>
              </div>

              {/* Public social links */}
              <div className="flex gap-2 mt-4">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Personal website"
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* CV download (public) */}
            {profile.cvAvailable && (
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download CV
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column (main content) ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <SectionHeading>About</SectionHeading>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <SectionHeading>Skills</SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experience.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <SectionHeading>Experience</SectionHeading>
                <ol className="relative border-l border-gray-200 space-y-6 ml-2">
                  {profile.experience.map((exp, i) => (
                    <li key={i} className="ml-5">
                      <span
                        className={`absolute -left-2 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white ${exp.current ? 'bg-blue-600' : 'bg-gray-300'}`}
                        aria-hidden="true"
                      />
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{exp.title}</p>
                        <time className="text-[11px] text-gray-400 flex-shrink-0">
                          {exp.period}
                        </time>
                      </div>
                      <p className="text-xs font-medium text-blue-700 mb-1.5">{exp.company}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Education */}
            {profile.education.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <SectionHeading>Education</SectionHeading>
                <ul className="space-y-4">
                  {profile.education.map((edu, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{edu.degree}</p>
                        <p className="text-xs text-gray-500">{edu.institution}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{edu.period}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {profile.achievements.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <SectionHeading>Achievements &amp; Recognition</SectionHeading>
                <ul className="space-y-4">
                  {profile.achievements.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 text-xs font-bold text-gray-400 w-10 mt-0.5">
                        {item.year}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Right column (sidebar) ─────────────────────────────────── */}
          <div className="space-y-5">
            {/* Contact — gated */}
            <ContactSection profile={profile} isAuthenticated={isAuthenticated} />

            {/* Membership info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <SectionHeading>Membership</SectionHeading>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tier</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${tierStyle}`}
                  >
                    {profile.membershipTier}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Number</span>
                  <span className="font-mono text-xs text-gray-700">
                    {profile.membershipNumber}
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/verify/${profile.membershipNumber}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-gray-200 text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
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
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    Verify membership
                  </Link>
                </div>
              </div>
            </div>

            {/* CV card */}
            {profile.cvAvailable && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <SectionHeading>Curriculum Vitae</SectionHeading>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download CV (PDF)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
