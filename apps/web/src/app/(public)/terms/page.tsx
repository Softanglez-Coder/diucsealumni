import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — CSE DIU Alumni',
  description: 'Terms and conditions governing use of the CSE DIU Alumni platform.',
};

const LAST_UPDATED = 'March 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By registering for or using the CSE DIU Alumni platform (&ldquo;the service&rdquo;),
              you agree to be bound by these Terms of Service. If you do not agree, please do not
              use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
            <p className="text-sm leading-relaxed">
              The platform is open to graduates, current students, and faculty of the Department of
              Computer Science &amp; Engineering at Dhaka International University, subject to
              membership approval. Membership is granted at the discretion of the department
              administrators.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Account Responsibilities</h2>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm">
              <li>
                You are responsible for maintaining the confidentiality of your account credentials.
              </li>
              <li>
                You must provide accurate and truthful information during registration and on your
                profile.
              </li>
              <li>You must notify us immediately of any unauthorised use of your account.</li>
              <li>
                You may not share your account with others or create accounts on behalf of others.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Acceptable Use</h2>
            <p className="text-sm leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm">
              <li>Post content that is defamatory, abusive, harassing, or discriminatory.</li>
              <li>Share false or misleading information about yourself or others.</li>
              <li>Use the platform for unsolicited commercial advertising or spam.</li>
              <li>Attempt to access areas of the service you are not authorised to use.</li>
              <li>
                Scrape, crawl, or otherwise extract data from the platform in bulk without written
                permission.
              </li>
              <li>Violate any applicable laws or university regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. User Content</h2>
            <p className="text-sm leading-relaxed">
              Content you post (profile information, forum posts, comments, job listings) remains
              your intellectual property. By posting it, you grant the platform a non-exclusive,
              royalty-free licence to display it to other users as part of the service. We reserve
              the right to remove any content that violates these terms or our community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Membership &amp; Payments</h2>
            <p className="text-sm leading-relaxed">
              Membership fees (where applicable) are processed through third-party payment
              providers. All fees are non-refundable unless required by applicable law. Failure to
              renew a membership will result in loss of access to members-only features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Termination</h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of
              these terms. You may request account deletion by contacting us at{' '}
              <a href="mailto:alumni@cse.diu.edu.bd" className="text-blue-600 hover:underline">
                alumni@cse.diu.edu.bd
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
            <p className="text-sm leading-relaxed">
              The platform is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
              guarantee uninterrupted or error-free operation. We are not responsible for content
              posted by other users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              To the fullest extent permitted by law, the platform operators shall not be liable for
              indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p className="text-sm leading-relaxed">
              These terms are governed by the laws of Bangladesh. Disputes shall be settled under
              the jurisdiction of the courts of Dhaka, Bangladesh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">
              We may update these terms at any time. We will notify you of significant changes by
              email. Continued use of the platform after changes constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
            <p className="text-sm">
              Questions about these terms?{' '}
              <a href="mailto:alumni@cse.diu.edu.bd" className="text-blue-600 hover:underline">
                Email us
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
