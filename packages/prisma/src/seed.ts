/**
 * Database seed script.
 * Seeds system roles, permissions, and a Super Admin account.
 *
 * Run with: pnpm db:seed
 * The Super Admin credentials are printed to stdout on first run.
 */

import { PrismaClient } from '../generated/client/index.js';

const prisma = new PrismaClient();

// ─── Permissions (resource:action) ───────────────────────────────────────────

const PERMISSIONS = [
  // Members
  { name: 'members:list', description: 'List all members' },
  { name: 'members:view', description: 'View member profile' },
  { name: 'members:approve', description: 'Approve membership applications' },
  { name: 'members:reject', description: 'Reject membership applications' },
  { name: 'members:suspend', description: 'Suspend or reinstate a member' },
  { name: 'members:export', description: 'Export member list' },

  // Events
  { name: 'events:list', description: 'List events' },
  { name: 'events:create', description: 'Create events' },
  { name: 'events:update', description: 'Update events' },
  { name: 'events:delete', description: 'Delete events' },
  { name: 'events:export-attendees', description: 'Export event attendee list' },

  // News
  { name: 'news:create', description: 'Create news articles' },
  { name: 'news:publish', description: 'Publish/unpublish news articles' },
  { name: 'news:delete', description: 'Delete news articles' },
  { name: 'news:moderate-comments', description: 'Approve or remove news comments' },

  // Forum
  { name: 'forum:moderate', description: 'Pin, lock, move, delete forum threads' },
  { name: 'forum:delete-post', description: 'Delete forum posts' },

  // Jobs
  { name: 'jobs:approve', description: 'Approve job postings' },
  { name: 'jobs:delete', description: 'Delete job postings' },

  // Donations
  { name: 'donations:view-reports', description: 'View donation reports' },
  { name: 'donations:manage-campaigns', description: 'Create and manage donation campaigns' },

  // Roles & Permissions
  { name: 'roles:manage', description: 'Create/edit/delete roles' },
  { name: 'permissions:manage', description: 'Assign/revoke permissions on roles' },

  // Users
  { name: 'users:manage', description: 'Edit, suspend, delete user accounts' },

  // Audit log
  { name: 'audit-log:view', description: 'View audit log' },

  // Membership cards
  { name: 'membership-cards:reissue', description: 'Reissue membership cards' },

  // Mentorship
  { name: 'mentorship:manage', description: 'Manage all mentorship relationships' },

  // System
  { name: 'system:settings', description: 'Manage system settings' },
  { name: 'system:analytics', description: 'View analytics dashboard' },
] as const;

// ─── System roles ─────────────────────────────────────────────────────────────

const SYSTEM_ROLES = [
  {
    name: 'Super Admin',
    description: 'Holds every permission. Cannot be modified or deleted.',
    isSystem: true,
    // Assigned all permissions during seeding
    permissionNames: PERMISSIONS.map((p) => p.name),
  },
  {
    name: 'Alumni',
    description: 'Default role assigned on membership approval. Can access member-only areas.',
    isSystem: true,
    permissionNames: ['members:view', 'events:list', 'jobs:approve'],
  },
  {
    name: 'Moderator',
    description: 'Content moderation: forum, news comments, job approvals.',
    isSystem: true,
    permissionNames: [
      'members:view',
      'events:list',
      'events:export-attendees',
      'news:moderate-comments',
      'forum:moderate',
      'forum:delete-post',
      'jobs:approve',
      'jobs:delete',
    ],
  },
  {
    name: 'Guest',
    description: 'Assigned to unverified or pending users. Public access only.',
    isSystem: true,
    permissionNames: [],
  },
] as const;

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Upsert permissions
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: { name: perm.name, description: perm.description },
    });
  }
  console.log(`✅ ${PERMISSIONS.length} permissions seeded`);

  // Upsert roles + assign permissions
  for (const roleData of SYSTEM_ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: { description: roleData.description, isSystem: roleData.isSystem },
      create: {
        name: roleData.name,
        description: roleData.description,
        isSystem: roleData.isSystem,
      },
    });

    // Remove existing permissions and re-assign
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

    for (const permName of roleData.permissionNames) {
      const permission = await prisma.permission.findUnique({ where: { name: permName } });
      if (permission) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: permission.id },
        });
      }
    }
  }
  console.log(`✅ ${SYSTEM_ROLES.length} roles seeded`);

  // Seed Super Admin user (only if no admin exists)
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
  if (!superAdminRole) throw new Error('Super Admin role not found after seeding');

  const adminEmail = process.env['SEED_ADMIN_EMAIL'] ?? 'admin@csediualumni.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    console.log(`ℹ️  Super Admin account already exists (${adminEmail})`);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bcrypt = require('bcrypt') as { hash: (pw: string, rounds: number) => Promise<string> };
    const tempPassword = `Admin@${Math.random().toString(36).slice(2, 10)}!`;
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        isEmailVerified: true,
        roles: {
          create: { roleId: superAdminRole.id },
        },
      },
    });

    console.log('');
    console.log('🔐 Super Admin account created:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${tempPassword}`);
    console.log('   ⚠️  Change this password immediately after first login!');
    console.log('');
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((error: unknown) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
