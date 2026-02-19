# Role-Based Access Control (RBAC) Design

## Overview

The platform uses a **dynamic, database-driven RBAC model**. Roles and permissions are records in the database — not hardcoded constants — so the System Administrator can create, modify, and assign them through the Admin Dashboard without any code changes or deployments.

---

## Core Concepts

| Concept        | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| **Permission** | A named capability string representing one action on one resource (e.g., `events:create`, `members:approve`) |
| **Role**       | A named group of permissions (e.g., `Moderator`, `Event Manager`)                                            |
| **User**       | An authenticated account. A user can hold multiple roles simultaneously                                      |

> Permissions are additive. A user's effective permission set is the union of all permissions across all their assigned roles.

---

## Database Schema (simplified)

```prisma
model Permission {
  id          String   @id @default(cuid())
  name        String   @unique   // e.g. "events:create"
  description String?
  roles       RolePermission[]
  createdAt   DateTime @default(now())
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique   // e.g. "Event Manager"
  description String?
  permissions RolePermission[]
  users       UserRole[]
  isSystem    Boolean  @default(false)  // system roles cannot be deleted
  createdAt   DateTime @default(now())
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}

model UserRole {
  userId    String
  roleId    String
  user      User   @relation(fields: [userId], references: [id])
  role      Role   @relation(fields: [roleId], references: [id])
  assignedAt DateTime @default(now())
  assignedBy String?  // userId of the admin who made the assignment
  @@id([userId, roleId])
}
```

---

## Permission Naming Convention

Permissions follow the pattern `<resource>:<action>`:

```
members:list
members:view
members:approve
members:suspend

events:list
events:create
events:update
events:delete
events:export-attendees

news:create
news:publish
news:delete

forum:moderate
forum:delete-post

jobs:approve
jobs:delete

donations:view-reports

roles:manage
permissions:manage
users:manage
audit-log:view
```

---

## Built-in System Roles

These roles are seeded on first deployment and cannot be deleted via the UI (`isSystem: true`):

| Role          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| `Super Admin` | Holds every permission. Cannot be modified or deleted                      |
| `Alumni`      | Default role assigned on membership approval. Can access member-only areas |
| `Guest`       | Assigned to unverified or pending users. Public access only                |

All other roles (e.g., `Moderator`, `Event Manager`, `Content Editor`) are created and configured by the Super Admin.

---

## Guard Implementation (NestJS)

```typescript
// Decorate a route with the required permission
@RequirePermission('events:create')
@Post()
async createEvent(@Body() dto: CreateEventDto) { ... }

// The guard resolves the user's effective permissions at request time
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<string>('permission', context.getHandler());
    if (!required) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) return false;

    return this.permissionsService.userHasPermission(userId, required);
  }
}
```

User permissions are **cached in Redis** (TTL: 5 minutes) and invalidated immediately when a role assignment or role permission changes.

---

## Permission Resolution Flow

```
Request
  │
  ▼
JwtAuthGuard  ──── invalid token ──▶  401 Unauthorized
  │ valid
  ▼
RbacGuard
  │
  ├── Fetch user's roles from Redis (or DB + cache)
  │
  ├── Resolve union of permissions across all roles
  │
  ├── required permission in set? ──── NO ──▶  403 Forbidden
  │           │
  │          YES
  ▼
Controller handler executes
```

---

## Admin Operations

All RBAC management actions are restricted to users with the `roles:manage` and `permissions:manage` permissions and are logged in the **Audit Log** with:

- Actor (who made the change)
- Timestamp
- Action (`role:created`, `permission:assigned`, `user:role-revoked`, etc.)
- Before and after values
