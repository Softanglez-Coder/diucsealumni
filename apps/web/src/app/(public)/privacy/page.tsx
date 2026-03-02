import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — CSE DIU Alumni',
  description: 'How CSE DIU Alumni collects, uses, and protects your personal data.',
};

const LAST_UPDATED = 'March 2026';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              The CSE DIU Alumni platform (&ldquo;we&rdquo;, &ldquo;the platform&rdquo;) is operated
              on behalf of the Department of Computer Science &amp; Engineering, Dhaka International
              University. This Privacy Policy explains how we collect, use, store, and protect
              personal information when you register or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm">
              <li>
                <strong>Account data:</strong> name, email address, password (hashed), batch year,
                and profile information you voluntarily provide.
              </li>
              <li>
                <strong>OAuth data:</strong> if you sign in with Google, we receive your name,
                email, and profile photo from your Google account.
              </li>
              <li>
                <strong>Professional data:</strong> job title, employer, skills, LinkedIn, GitHub,
                CV uploads, and other profile fields you choose to fill in.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, actions taken (RSVPs, forum posts,
                donations), and technical information such as IP address, browser type, and device.
              </li>
              <li>
                <strong>Payment data:</strong> processed through SSLCommerz or Stripe. We do not
                store card numbers — only transaction IDs and amounts.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm">
              <li>To create and maintain your membership account and profile.</li>
              <li>To verify your identity and enforce access controls.</li>
              <li>To send transactional emails (verification, password reset, event reminders).</li>
              <li>To enable alumni directory listings (subject to your privacy settings).</li>
              <li>To process donations and issue receipts.</li>
              <li>To improve the platform through aggregated analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing</h2>
            <p className="text-sm">We do not sell your personal data. We may share it with:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm mt-2">
              <li>
                <strong>Payment processors</strong> (SSLCommerz, Stripe) — only the minimum data
                required to complete a transaction.
              </li>
              <li>
                <strong>Email providers</strong> (SendGrid / SMTP) — to deliver transactional
                emails.
              </li>
              <li>
                <strong>Cloud storage</strong> (AWS S3) — for profile photos, CVs, and event images.
              </li>
              <li>
                <strong>Error monitoring</strong> (Sentry) — anonymised error and performance data.
              </li>
              <li>
                <strong>Department administrators</strong> — for membership management purposes, in
                line with university policies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-sm">
              We retain your account data for as long as your membership is active. If you request
              account deletion, we will remove your personal data within 30 days, subject to any
              legal retention obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-sm mb-2">You have the right to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your account and data.</li>
              <li>Adjust your profile visibility (public, members-only, private).</li>
              <li>Opt out of marketing emails at any time.</li>
            </ul>
            <p className="text-sm mt-3">
              To exercise these rights, email{' '}
              <a href="mailto:alumni@cse.diu.edu.bd" className="text-blue-600 hover:underline">
                alumni@cse.diu.edu.bd
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Security</h2>
            <p className="text-sm">
              We use industry-standard security practices including HTTPS encryption, bcrypt
              password hashing, JWT-based sessions stored in HttpOnly cookies, and access controls
              enforced on every API endpoint. Sensitive fields such as email and phone numbers are
              encrypted at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p className="text-sm">
              We use an HttpOnly, Secure session cookie to maintain your login session. We also use
              Google Analytics 4 for aggregated usage analytics. You can opt out of analytics via
              your browser&rsquo;s privacy controls or a browser extension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-sm">
              We may update this policy from time to time. We will notify members of material
              changes via email and by posting the updated policy on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p className="text-sm">
              For privacy-related questions, contact us at{' '}
              <a href="mailto:alumni@cse.diu.edu.bd" className="text-blue-600 hover:underline">
                alumni@cse.diu.edu.bd
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
