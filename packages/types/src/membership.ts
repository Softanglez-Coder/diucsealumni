import { z } from 'zod';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const MembershipTierSchema = z.enum(['REGULAR', 'LIFE', 'HONORARY']);
export type MembershipTier = z.infer<typeof MembershipTierSchema>;

export const MembershipTierCode: Record<MembershipTier, string> = {
  REGULAR: 'REG',
  LIFE: 'LIF',
  HONORARY: 'HON',
};

export const MembershipStatusSchema = z.enum(['ACTIVE', 'EXPIRED', 'SUSPENDED', 'PENDING']);
export type MembershipStatus = z.infer<typeof MembershipStatusSchema>;

export const ApplicationStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REVISION_REQUESTED',
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

// ─── Membership number ────────────────────────────────────────────────────────

/**
 * Generates the display format for a membership number.
 * Format: CSEDIA-<TIER>-<YEAR>-<SEQUENCE>
 * Example: CSEDIA-REG-2025-00142
 */
export function formatMembershipNumber(
  tier: MembershipTier,
  year: number,
  sequence: number,
): string {
  const tierCode = MembershipTierCode[tier];
  const paddedSeq = String(sequence).padStart(5, '0');
  return `CSEDIA-${tierCode}-${year}-${paddedSeq}`;
}

export const MembershipNumberSchema = z
  .string()
  .regex(/^CSEDIA-(REG|LIF|HON)-\d{4}-\d{5}$/, 'Invalid membership number format');
