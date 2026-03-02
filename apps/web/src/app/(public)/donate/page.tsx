'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CAMPAIGNS = [
  {
    value: 'scholarships',
    label: '🎓 Scholarships',
    description: 'Fund merit-based and need-based scholarships for CSE students.',
  },
  {
    value: 'events',
    label: '🎉 Events & Reunions',
    description: 'Support annual reunions, tech talks, and career fairs.',
  },
  {
    value: 'infrastructure',
    label: '🖥️ Lab & Infrastructure',
    description: 'Help upgrade lab equipment and digital resources.',
  },
  {
    value: 'general',
    label: '💛 General Fund',
    description: 'Flexible funds directed where most needed.',
  },
];

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const PAYMENT_METHODS = [
  {
    value: 'sslcommerz',
    label: 'SSLCommerz',
    subtitle: 'Bangladeshi cards, mobile banking (BDT)',
    flag: '🇧🇩',
  },
  {
    value: 'stripe',
    label: 'Stripe',
    subtitle: 'International cards (USD / EUR)',
    flag: '🌐',
  },
];

export default function DonatePage() {
  const router = useRouter();

  const [campaign, setCampaign] = useState('scholarships');
  const [presetAmount, setPresetAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('sslcommerz');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolvedAmount = presetAmount ?? Number(customAmount);

  function validate() {
    const e: Record<string, string> = {};
    if (!resolvedAmount || resolvedAmount < 50) e['amount'] = 'Minimum donation amount is ৳50.';
    if (!anonymous && !name.trim()) e['name'] = 'Please enter your name.';
    if (!anonymous && !email.trim()) e['email'] = 'Please enter your email.';
    if (!anonymous && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e['email'] = 'Please enter a valid email address.';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const params = new URLSearchParams({
      amount: String(resolvedAmount),
      campaign,
      method: paymentMethod,
      ...(anonymous ? { anonymous: '1' } : { name, email }),
      ...(message ? { message } : {}),
    });

    router.push(`/donate/payment?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-700 to-emerald-800 text-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Make a Donation</h1>
          <p className="text-lg text-emerald-100">
            Your contribution directly supports CSE students, alumni events, and departmental
            growth. Every amount matters.
          </p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-14 px-4">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Left: form fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Choose campaign */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Choose a cause</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAMPAIGNS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCampaign(c.value)}
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      campaign === c.value
                        ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm mb-1">{c.label}</div>
                    <div className="text-xs text-gray-500">{c.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Amount */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Donation amount</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setPresetAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`px-5 py-2.5 rounded-lg border font-semibold text-sm transition-colors ${
                      presetAmount === amt
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-emerald-400'
                    }`}
                  >
                    ৳{amt.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPresetAmount(null)}
                  className={`px-5 py-2.5 rounded-lg border font-semibold text-sm transition-colors ${
                    presetAmount === null
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600'
                      : 'border-gray-200 text-gray-700 hover:border-emerald-400'
                  }`}
                >
                  Custom
                </button>
              </div>
              {presetAmount === null && (
                <div>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ৳
                    </span>
                    <input
                      type="number"
                      min={50}
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {errors['amount'] && (
                    <p className="text-xs text-red-600 mt-1">{errors['amount']}</p>
                  )}
                </div>
              )}
              {presetAmount !== null && errors['amount'] && (
                <p className="text-xs text-red-600 mt-1">{errors['amount']}</p>
              )}
            </div>

            {/* 3. Donor details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">3. Your details</h2>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="text-sm text-gray-600">Donate anonymously</span>
                </label>
              </div>
              {anonymous ? (
                <div className="rounded-lg bg-gray-50 border border-dashed border-gray-300 p-4 text-sm text-gray-500 text-center">
                  Your identity will not be revealed. The donation will appear as
                  &quot;Anonymous&quot; in our records.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors['name'] && (
                      <p className="text-xs text-red-600 mt-1">{errors['name']}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors['email'] && (
                      <p className="text-xs text-red-600 mt-1">{errors['email']}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Your payment receipt will be sent here.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Leave a note or dedication..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Payment method */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Payment method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                      paymentMethod === pm.value
                        ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={() => setPaymentMethod(pm.value)}
                      className="accent-emerald-600"
                    />
                    <span className="text-xl">{pm.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{pm.label}</div>
                      <div className="text-xs text-gray-500">{pm.subtitle}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 active:scale-[0.99] transition-all"
            >
              Proceed to Payment →
            </button>
          </div>

          {/* Right: summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Donation summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cause</span>
                  <span className="font-medium text-gray-900">
                    {CAMPAIGNS.find((c) => c.value === campaign)?.label ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-semibold text-emerald-700 text-base">
                    {resolvedAmount ? `৳${resolvedAmount.toLocaleString()}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Donor</span>
                  <span className="font-medium text-gray-900">
                    {anonymous ? 'Anonymous' : name || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900">
                    {PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.label}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-emerald-600 shrink-0"
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
                Your payment is secured with 256-bit SSL encryption.
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800">
                Receipts are emailed instantly. Donations are non-refundable unless there is a
                processing error.
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-50 border-t border-gray-100 py-8 px-4">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">🔒 256-bit SSL</span>
          <span className="flex items-center gap-1.5">🧾 Instant receipt</span>
          <span className="flex items-center gap-1.5">🏦 SSLCommerz &amp; Stripe</span>
          <span className="flex items-center gap-1.5">🕵️ Anonymous option</span>
        </div>
      </section>

      <div className="py-6 text-center text-sm text-gray-400">
        Want to link this donation to your alumni profile?{' '}
        <Link href="/auth/login" className="text-emerald-700 hover:underline font-medium">
          Sign in
        </Link>{' '}
        first.
      </div>
    </div>
  );
}
