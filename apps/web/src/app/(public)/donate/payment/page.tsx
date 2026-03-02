'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const CAMPAIGN_LABELS: Record<string, string> = {
  scholarships: '🎓 Scholarships',
  events: '🎉 Events & Reunions',
  infrastructure: '🖥️ Lab & Infrastructure',
  general: '💛 General Fund',
};

const METHOD_LABELS: Record<string, { label: string; flag: string; instructions: string }> = {
  sslcommerz: {
    label: 'SSLCommerz',
    flag: '🇧🇩',
    instructions:
      'You will be redirected to the SSLCommerz secure gateway to complete payment with your Bangladeshi card or mobile banking (bKash, Nagad, Rocket, etc.).',
  },
  stripe: {
    label: 'Stripe',
    flag: '🌐',
    instructions:
      "You will be redirected to Stripe's secure checkout to pay with your international Visa, Mastercard, or American Express card.",
  },
};

type PaymentState = 'idle' | 'processing' | 'success';

export default function DonatePaymentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const amount = params.get('amount') ?? '0';
  const campaign = params.get('campaign') ?? 'general';
  const method = params.get('method') ?? 'sslcommerz';
  const name = params.get('name') ?? '';
  const email = params.get('email') ?? '';
  const message = params.get('message') ?? '';
  const isAnonymous = params.get('anonymous') === '1';

  const [paymentState, setPaymentState] = useState<PaymentState>('idle');

  const campaignLabel = CAMPAIGN_LABELS[campaign] ?? 'General Fund';
  const methodInfo = METHOD_LABELS[method] ?? {
    label: 'SSLCommerz',
    flag: '🇧🇩',
    instructions:
      'You will be redirected to the SSLCommerz secure gateway to complete payment with your Bangladeshi card or mobile banking (bKash, Nagad, Rocket, etc.).',
  };

  const amountNum = Number(amount);

  function handleConfirm() {
    setPaymentState('processing');
    // Simulate redirect to payment gateway + callback
    setTimeout(() => {
      setPaymentState('success');
    }, 2200);
  }

  if (paymentState === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h1>
          <p className="text-gray-500 mb-1">
            Your donation of{' '}
            <span className="font-semibold text-emerald-700">৳{amountNum.toLocaleString()}</span> to{' '}
            <span className="font-medium text-gray-900">{campaignLabel}</span> has been received.
          </p>
          {!isAnonymous && email && (
            <p className="text-sm text-gray-400 mb-6">A receipt has been sent to {email}.</p>
          )}
          {!email && (
            <p className="text-sm text-gray-400 mb-6">Your anonymous donation has been recorded.</p>
          )}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/donate"
              className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Make another donation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700">Donation Checkout</span>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
            <svg
              className="w-3.5 h-3.5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secured
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center gap-2 text-xs text-gray-400">
          <span className="text-emerald-600 font-semibold">Donation details</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-gray-700">Review &amp; Pay</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-emerald-700 px-6 py-4">
            <p className="text-emerald-200 text-xs uppercase tracking-wider mb-1">
              You are donating
            </p>
            <p className="text-4xl font-bold text-white">৳{amountNum.toLocaleString()}</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <Row label="Cause" value={campaignLabel} />
            <Row label="Donor" value={isAnonymous ? 'Anonymous' : name || '—'} />
            {!isAnonymous && email && <Row label="Receipt to" value={email} />}
            {message && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Message</p>
                <p className="text-sm text-gray-700 italic">&ldquo;{message}&rdquo;</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment gateway card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{methodInfo.flag}</span>
            <div>
              <p className="font-semibold text-gray-900">{methodInfo.label}</p>
              <p className="text-xs text-gray-500">Selected payment gateway</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{methodInfo.instructions}</p>
        </div>

        {/* Info notices */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Before you confirm</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
            <li>Donations are non-refundable unless there is a payment processing error.</li>
            <li>Your receipt will be emailed to you within a few minutes of completion.</li>
            <li>
              Clicking &quot;Confirm &amp; Pay&quot; will redirect you to the {methodInfo.label}{' '}
              gateway.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={paymentState === 'processing'}
            className="w-full py-4 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {paymentState === 'processing' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Redirecting to {methodInfo.label}…
              </>
            ) : (
              <>🔒 Confirm &amp; Pay ৳{amountNum.toLocaleString()}</>
            )}
          </button>

          <button
            onClick={() => router.back()}
            disabled={paymentState === 'processing'}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Edit donation details
          </button>
        </div>

        {/* Security footer */}
        <p className="text-center text-xs text-gray-400">
          🔒 Payments are processed securely. CSE DIU Alumni never stores your card details.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
