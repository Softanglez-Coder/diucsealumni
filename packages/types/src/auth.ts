import { z } from 'zod';

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a symbol'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

// ─── JWT payload ─────────────────────────────────────────────────────────────

export const JwtPayloadSchema = z.object({
  sub: z.string(), // user ID
  email: z.string().email(),
  permissions: z.array(z.string()),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// ─── Auth response ────────────────────────────────────────────────────────────

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().nullable(),
    permissions: z.array(z.string()),
  }),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
