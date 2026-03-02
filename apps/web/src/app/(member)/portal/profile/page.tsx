'use client';

import { useEffect, useRef, useState } from 'react';

import { getMyProfile, updateMyProfile } from '@/lib/api/members.client';

// ─── Types ────────────────────────────────────────────────────────────────────

type PrivacyLevel = 'public' | 'members' | 'private';

interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  batchYear: string;
  jobTitle: string;
  employer: string;
  location: string;
  bio: string;
  skills: string;
  linkedin: string;
  github: string;
  website: string;
  privacy: PrivacyLevel;
}

const INITIAL_FORM: ProfileForm = {
  firstName: '',
  lastName: '',
  username: '',
  batchYear: '',
  jobTitle: '',
  employer: '',
  location: '',
  bio: '',
  skills: '',
  linkedin: '',
  github: '',
  website: '',
  privacy: 'public',
};

// ─── Privacy mapping helpers ──────────────────────────────────────────────────

function toApiVisibility(p: PrivacyLevel): 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE' {
  if (p === 'public') return 'PUBLIC';
  if (p === 'members') return 'MEMBERS_ONLY';
  return 'PRIVATE';
}

function fromApiVisibility(v: string): PrivacyLevel {
  if (v === 'PUBLIC') return 'public';
  if (v === 'MEMBERS_ONLY') return 'members';
  return 'private';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

const textareaCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none';

// ─── Avatar uploader ──────────────────────────────────────────────────────────

function AvatarUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div className="flex items-center gap-5">
      {/* Avatar preview */}
      <div className="relative shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="Profile photo preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-400 shadow">
            <PersonIcon />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white shadow hover:bg-blue-800 transition-colors"
          aria-label="Upload photo"
        >
          <CameraIcon />
        </button>
      </div>

      {/* Upload button + hint */}
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <UploadIcon />
          Upload photo
        </button>
        <p className="mt-1.5 text-xs text-gray-400">JPG, PNG or WebP. Max 2 MB.</p>
        {preview && (
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="mt-1 text-xs text-red-500 hover:underline"
          >
            Remove photo
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-hidden="true"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ─── CV uploader ──────────────────────────────────────────────────────────────

function CvUploader() {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  }

  return (
    <div>
      <div
        className="relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-8 cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload CV"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-400 shadow-sm">
          <DocumentIcon />
        </div>
        {fileName ? (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-400 mt-0.5">Click to replace</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Drop your CV here or{' '}
              <span className="text-blue-600 hover:underline">browse files</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">PDF only, max 5 MB</p>
          </div>
        )}
      </div>
      {fileName && (
        <button
          type="button"
          onClick={() => setFileName(null)}
          className="mt-2 text-xs text-red-500 hover:underline"
        >
          Remove CV
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        aria-hidden="true"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ─── Privacy selector ─────────────────────────────────────────────────────────

const PRIVACY_OPTIONS: { value: PrivacyLevel; label: string; description: string }[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone on the internet can view your profile.',
  },
  {
    value: 'members',
    label: 'Members only',
    description: 'Only logged-in alumni members can view your profile.',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Your profile is hidden from everyone except administrators.',
  },
];

function PrivacySelector({
  value,
  onChange,
}: {
  value: PrivacyLevel;
  onChange: (v: PrivacyLevel) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {PRIVACY_OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={`flex-1 flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            value === opt.value
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="privacy"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span
            className={`text-sm font-semibold ${value === opt.value ? 'text-blue-700' : 'text-gray-800'}`}
          >
            {opt.label}
          </span>
          <span className="text-xs text-gray-500 leading-relaxed">{opt.description}</span>
        </label>
      ))}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-medium shadow-xl transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <CheckIcon />
      Profile saved!
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalProfilePage() {
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load real profile data on mount
  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        setForm({
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.profile?.username ?? '',
          batchYear: profile.profile?.batchYear ? String(profile.profile.batchYear) : '',
          jobTitle: profile.profile?.jobTitle ?? '',
          employer: profile.profile?.employer ?? '',
          location: profile.profile?.location ?? '',
          bio: profile.profile?.bio ?? '',
          skills: (profile.profile?.skills ?? []).join(', '),
          linkedin: profile.profile?.linkedinUrl ?? '',
          github: profile.profile?.githubUrl ?? '',
          website: profile.profile?.websiteUrl ?? '',
          privacy: fromApiVisibility(profile.profile?.visibility ?? 'PUBLIC'),
        });
      })
      .catch(() => null)
      .finally(() => setLoadingProfile(false));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Build update payload, omitting undefined values (exactOptionalPropertyTypes)
      type UpdatePayload = Parameters<typeof updateMyProfile>[0];
      const payload: UpdatePayload = { visibility: toApiVisibility(form.privacy) };
      if (form.firstName) payload.firstName = form.firstName;
      if (form.lastName) payload.lastName = form.lastName;
      if (form.username) payload.username = form.username;
      if (form.batchYear) payload.batchYear = Number(form.batchYear);
      if (form.jobTitle) payload.jobTitle = form.jobTitle;
      if (form.employer) payload.employer = form.employer;
      if (form.location) payload.location = form.location;
      if (form.bio) payload.bio = form.bio;
      if (form.linkedin) payload.linkedinUrl = form.linkedin;
      if (form.github) payload.githubUrl = form.github;
      if (form.website) payload.websiteUrl = form.website;
      payload.skills = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateMyProfile(payload);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch {
      // TODO: show error toast
    } finally {
      setSaving(false);
    }
  }

  const batchYears = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));

  if (loadingProfile) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-6"
      >
        {/* Page header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Keep your profile up-to-date so the community can find and connect with you.
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors shadow-sm"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {/* Photo */}
        <SectionCard title="Profile photo">
          <AvatarUploader />
        </SectionCard>

        {/* Personal info */}
        <SectionCard
          title="Personal information"
          description="This information appears on your public profile."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First name" htmlFor="firstName">
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="e.g. Rahim"
                value={form.firstName}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <Field label="Last name" htmlFor="lastName">
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="e.g. Uddin"
                value={form.lastName}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <Field
              label="Username"
              htmlFor="username"
              hint="Your public profile URL will be /alumni/[username]"
            >
              <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition">
                <span className="inline-flex items-center px-3.5 bg-gray-50 text-sm text-gray-400 border-r border-gray-200 shrink-0">
                  /alumni/
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="rahimuddin"
                  value={form.username}
                  onChange={handleChange}
                  className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                />
              </div>
            </Field>

            <Field label="Batch year" htmlFor="batchYear">
              <select
                id="batchYear"
                name="batchYear"
                value={form.batchYear}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select year</option>
                {batchYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Current location" htmlFor="location" hint="City, Country">
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                value={form.location}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* Professional info */}
        <SectionCard
          title="Professional information"
          description="Let alumni know where you work and what you do."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Job title" htmlFor="jobTitle">
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={form.jobTitle}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <Field label="Employer / Company" htmlFor="employer">
              <input
                id="employer"
                name="employer"
                type="text"
                placeholder="e.g. BRAC IT"
                value={form.employer}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* Bio & skills */}
        <SectionCard
          title="Bio & skills"
          description="Tell the community about yourself and what you're good at."
        >
          <div className="space-y-5">
            <Field label="Bio" htmlFor="bio" hint="Max 500 characters.">
              <textarea
                id="bio"
                name="bio"
                rows={4}
                maxLength={500}
                placeholder="A short intro about yourself — your background, interests, and what you're currently working on."
                value={form.bio}
                onChange={handleChange}
                className={textareaCls}
              />
              <p className="mt-1.5 text-xs text-gray-400 text-right">{form.bio.length}/500</p>
            </Field>

            <Field
              label="Skills"
              htmlFor="skills"
              hint="Add comma-separated skills e.g. Python, React, Machine Learning"
            >
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="Python, React, Machine Learning, DevOps…"
                value={form.skills}
                onChange={handleChange}
                className={inputCls}
              />
              {/* Skill chips preview */}
              {form.skills.trim() && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </Field>
          </div>
        </SectionCard>

        {/* Social links */}
        <SectionCard
          title="Social links"
          description="Link your professional profiles so others can connect with you."
        >
          <div className="space-y-5">
            <Field label="LinkedIn" htmlFor="linkedin">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition">
                <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-400 border-r border-gray-200 shrink-0">
                  <LinkedInIcon />
                </span>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                />
              </div>
            </Field>

            <Field label="GitHub" htmlFor="github">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition">
                <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-400 border-r border-gray-200 shrink-0">
                  <GitHubIcon />
                </span>
                <input
                  id="github"
                  name="github"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={form.github}
                  onChange={handleChange}
                  className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                />
              </div>
            </Field>

            <Field label="Personal website" htmlFor="website">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition">
                <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-400 border-r border-gray-200 shrink-0">
                  <GlobeIcon />
                </span>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={form.website}
                  onChange={handleChange}
                  className="flex-1 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* CV */}
        <SectionCard
          title="CV / Résumé"
          description="Upload your CV so visitors can download it from your public profile. PDF only, max 5 MB."
        >
          <CvUploader />
        </SectionCard>

        {/* Privacy */}
        <SectionCard
          title="Profile visibility"
          description="Control who can see your public profile page."
        >
          <PrivacySelector
            value={form.privacy}
            onChange={(v) => setForm((prev) => ({ ...prev, privacy: v }))}
          />
        </SectionCard>

        {/* Mobile save button */}
        <div className="sm:hidden">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors shadow-sm"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <SaveToast visible={toastVisible} />
    </>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PersonIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
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
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  );
}
