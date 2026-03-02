import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — CSE DIU Alumni',
  description:
    'Get in touch with the CSE DIU Alumni team. Reach out for membership queries, technical support, or general enquiries.',
};

const CONTACT_ITEMS = [
  {
    label: 'Email',
    value: 'alumni@cse.diu.edu.bd',
    description: 'For general enquiries and membership support. We reply within 2 working days.',
    href: 'mailto:alumni@cse.diu.edu.bd',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: 'Address',
    value: 'DIU Permanent Campus, Ashulia, Savar, Dhaka – 1349, Bangladesh',
    description: 'Department of Computer Science & Engineering, Dhaka International University.',
    href: 'https://maps.google.com/?q=Dhaka+International+University+Ashulia',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    value: 'CSE DIU Alumni Group',
    description: 'Join our Facebook community for news and discussions.',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Us</h1>
          <p className="mt-3 text-lg text-gray-600">
            Have a question or need help? Reach out — we&rsquo;re happy to assist.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {CONTACT_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-sm font-medium text-gray-900 mb-1 break-words">{item.value}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </a>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="bg-white rounded-xl border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {[
              {
                q: 'How do I apply for membership?',
                a: 'Click "Apply for membership" in the navigation or go to /membership. Fill in the registration form — it takes about 5 minutes. Applications are reviewed within 2–3 working days.',
              },
              {
                q: 'I forgot my password. How do I reset it?',
                a: 'Go to the login page and click "Forgot password". A reset link will be sent to your registered email address.',
              },
              {
                q: 'Can I update my profile information?',
                a: 'Yes. Once logged in, go to My Portal → Edit Profile to update your details, photo, CV, and privacy settings.',
              },
              {
                q: 'How do I report a technical issue?',
                a: 'Email us at alumni@cse.diu.edu.bd with a brief description and a screenshot if possible. We typically respond within one working day.',
              },
            ].map((item) => (
              <div key={item.q}>
                <dt className="text-sm font-semibold text-gray-900">{item.q}</dt>
                <dd className="mt-1 text-sm text-gray-500">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
