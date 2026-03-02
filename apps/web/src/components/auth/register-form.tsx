'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api/v1';

const BATCH_YEARS = Array.from({ length: 25 }, (_, i) => 2024 - i);

const MEMBERSHIP_TIERS = [
  { value: 'regular', label: 'Regular Member', description: 'Standard alumni membership' },
  { value: 'life', label: 'Life Member', description: 'Lifetime alumni membership' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | undefined;
  hint?: string | undefined;
}

function Field({ label, id, error, hint, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {props.required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        {...props}
        className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-400 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
        } ${props.className ?? ''}`}
      />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ['Account', 'Academic', 'Professional', 'Review'];

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-0" aria-label="Registration progress">
      {STEPS.map((label, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <li key={label} className="flex items-center">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border-2 transition-colors ${
                done
                  ? 'bg-blue-700 border-blue-700 text-white'
                  : (active
                    ? 'border-blue-700 text-blue-700 bg-white'
                    : 'border-gray-300 text-gray-400 bg-white')
              }`}
              aria-current={active ? 'step' : undefined}
            >
              {done ? (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                idx + 1
              )}
            </span>
            <span
              className={`ml-1.5 text-xs font-medium hidden sm:block ${active ? 'text-blue-700' : (done ? 'text-gray-600' : 'text-gray-400')}`}
            >
              {label}
            </span>
            {idx < STEPS.length - 1 && (
              <span
                className={`mx-2 h-px flex-1 w-6 sm:w-10 ${done ? 'bg-blue-700' : 'bg-gray-200'}`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ─── Form state types ─────────────────────────────────────────────────────────

interface FormData {
  // Step 0 — Account
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 1 — Academic
  batchYear: string;
  studentId: string;
  membershipTier: string;
  // Step 2 — Professional
  jobTitle: string;
  employer: string;
  linkedinUrl: string;
  bio: string;
  // Step 3 — Review
  agreeTerms: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  batchYear: '',
  studentId: '',
  membershipTier: 'regular',
  jobTitle: '',
  employer: '',
  linkedinUrl: '',
  bio: '',
  agreeTerms: false,
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {};

  switch (step) {
    case 0: {
      if (!data.firstName.trim()) errors.firstName = 'First name is required.';
      if (!data.lastName.trim()) errors.lastName = 'Last name is required.';
      if (!data.email.trim()) {
        errors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
      }
      if (!data.password) {
        errors.password = 'Password is required.';
      } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(data.password)) {
        errors.password = 'Password must contain uppercase, lowercase, a number, and a symbol.';
      }
      if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }

      break;
    }
    case 1: {
      if (!data.batchYear) errors.batchYear = 'Batch year is required.';
      if (!data.studentId.trim()) errors.studentId = 'Student ID is required.';

      break;
    }
    case 3: {
      if (!data.agreeTerms) errors.agreeTerms = 'You must agree to the terms to proceed.';

      break;
    }
    // No default
  }

  return errors;
}

// ─── Register form ────────────────────────────────────────────────────────────

/**
 * Multi-step membership application form.
 * Step 0 — Account details (name, email, password)
 * Step 1 — Academic background (batch year, student ID, tier)
 * Step 2 — Professional info (job title, employer, LinkedIn, bio)
 * Step 3 — Review & submit
 */
export function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function set(field: keyof FormData, value: string | boolean) {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function next() {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function back() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const stepErrors = validateStep(3, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          batchYear: Number(data.batchYear),
          studentId: data.studentId,
          membershipTier: data.membershipTier,
          jobTitle: data.jobTitle || undefined,
          employer: data.employer || undefined,
          linkedinUrl: data.linkedinUrl || undefined,
          bio: data.bio || undefined,
        }),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(body?.detail ?? body?.message ?? 'Registration failed. Please try again.');
        return;
      }

      router.replace('/auth/register/success');
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <StepIndicator current={step} />
      </div>

      {/* ── Step 0: Account ─────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First name"
              id="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={data.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              error={errors.firstName}
              disabled={submitting}
            />
            <Field
              label="Last name"
              id="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={data.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              error={errors.lastName}
              disabled={submitting}
            />
          </div>
          <Field
            label="Email address"
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            disabled={submitting}
          />
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password{' '}
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={data.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="••••••••"
                className={`block w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'}`}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Min 8 chars · uppercase · lowercase · number · symbol
            </p>
            <FieldError message={errors.password} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password{' '}
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={data.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={`block w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 ${errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'}`}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <FieldError message={errors.confirmPassword} />
          </div>
          <button
            type="button"
            onClick={next}
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors"
          >
            Continue
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* ── Step 1: Academic ────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700">
              Batch year{' '}
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <select
              id="batchYear"
              required
              value={data.batchYear}
              onChange={(e) => set('batchYear', e.target.value)}
              className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 ${errors.batchYear ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'}`}
            >
              <option value="">Select your batch year</option>
              {BATCH_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <FieldError message={errors.batchYear} />
          </div>
          <Field
            label="Student ID"
            id="studentId"
            type="text"
            required
            placeholder="e.g. 161-15-7777"
            hint="Your official DIU student ID number"
            value={data.studentId}
            onChange={(e) => set('studentId', e.target.value)}
            error={errors.studentId}
          />
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">Membership tier</legend>
            {MEMBERSHIP_TIERS.map((tier) => (
              <label
                key={tier.value}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  data.membershipTier === tier.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="membershipTier"
                  value={tier.value}
                  checked={data.membershipTier === tier.value}
                  onChange={(e) => set('membershipTier', e.target.value)}
                  className="mt-0.5 accent-blue-700"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{tier.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tier.description}</p>
                </div>
              </label>
            ))}
          </fieldset>
          <NavigationButtons onBack={back} onNext={next} />
        </div>
      )}

      {/* ── Step 2: Professional ────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 -mt-2">
            Optional — you can update these later from your profile.
          </p>
          <Field
            label="Job title"
            id="jobTitle"
            type="text"
            placeholder="e.g. Software Engineer"
            value={data.jobTitle}
            onChange={(e) => set('jobTitle', e.target.value)}
            error={errors.jobTitle}
          />
          <Field
            label="Employer / Company"
            id="employer"
            type="text"
            placeholder="e.g. Acme Corp"
            value={data.employer}
            onChange={(e) => set('employer', e.target.value)}
            error={errors.employer}
          />
          <Field
            label="LinkedIn profile URL"
            id="linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            value={data.linkedinUrl}
            onChange={(e) => set('linkedinUrl', e.target.value)}
            error={errors.linkedinUrl}
          />
          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Short bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={data.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Tell the community a bit about yourself…"
              maxLength={500}
              className="block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{data.bio.length}/500</p>
          </div>
          <NavigationButtons onBack={back} onNext={next} />
        </div>
      )}

      {/* ── Step 3: Review & submit ─────────────────────────────────── */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {apiError}
            </div>
          )}

          {/* Summary */}
          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            <SummaryRow label="Name" value={`${data.firstName} ${data.lastName}`} />
            <SummaryRow label="Email" value={data.email} />
            <SummaryRow label="Batch year" value={data.batchYear} />
            <SummaryRow label="Student ID" value={data.studentId} />
            <SummaryRow
              label="Membership tier"
              value={
                MEMBERSHIP_TIERS.find((t) => t.value === data.membershipTier)?.label ??
                data.membershipTier
              }
            />
            {data.jobTitle && <SummaryRow label="Job title" value={data.jobTitle} />}
            {data.employer && <SummaryRow label="Employer" value={data.employer} />}
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            <strong>Approval required.</strong> Your application will be reviewed by the admin team.
            You&apos;ll receive an email once your membership is approved.
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.agreeTerms}
              onChange={(e) => set('agreeTerms', e.target.checked)}
              className="mt-0.5 accent-blue-700"
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                Privacy Policy
              </Link>
              , and I confirm that all information provided is accurate.
            </span>
          </label>
          <FieldError message={errors.agreeTerms} />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={back}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting || !data.agreeTerms}
              className="flex-1 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting…
                </span>
              ) : (
                'Submit application'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4 px-4 py-2.5">
      <dt className="w-32 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm text-gray-900">{value || '—'}</dd>
    </div>
  );
}

function NavigationButtons({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex-1 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
