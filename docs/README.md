# CSE DIU Alumni — Documentation

Welcome to the official documentation for the **CSE DIU Alumni** platform, a web application serving the alumni community of the Computer Science and Engineering department at Dhaka International University (DIU).

## Project Overview

The platform aims to:

- Connect CSE alumni with each other and with current students.
- Manage alumni memberships, profiles, and directories.
- Facilitate events, news, mentorship, job opportunities, and fundraising.
- Provide administrators with a robust, permission-driven control panel.

## Documentation Index

| Section                                                                     | Description                                                    |
| --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Requirements / Functional](./requirements/functional.md)                   | Feature specifications and user stories                        |
| [Requirements / Non-Functional](./requirements/non-functional.md)           | Quality attributes: SEO, security, scalability, etc.           |
| [Architecture / Overview](./architecture/README.md)                         | High-level system design and tech stack                        |
| [Architecture / Tech Stack](./architecture/tech-stack.md)                   | Technology choices with justifications                         |
| [Architecture / System Design](./architecture/system-design.md)             | System layers, diagrams, and key design decisions              |
| [Architecture / Authentication](./architecture/authentication.md)           | OAuth 2.0 (Google Sign-In), JWT strategy, token lifecycle      |
| [Architecture / RBAC](./architecture/rbac.md)                               | Role-based access control design                               |
| [Architecture / ADRs](./architecture/adr/README.md)                         | Architecture Decision Records                                  |
| [Development / Getting Started](./development/getting-started.md)           | Local environment setup                                        |
| [Development / Git Workflow](./development/git-workflow.md)                 | Branching strategy and PR process                              |
| [Development / Git Hooks](./development/git-hooks.md)                       | Husky hooks, lint-staged, commitlint, GitHub branch protection |
| [Development / Code Standards](./development/code-standards.md)             | TypeScript, linting, formatting, commit conventions            |
| [Development / Testing](./development/testing.md)                           | Testing strategy and standards                                 |
| [Deployment / Overview](./deployment/README.md)                             | Environments and deployment pipeline                           |
| [Deployment / Infrastructure](./deployment/infrastructure.md)               | Docker, CI/CD, hosting, backups                                |
| [Deployment / Environment Variables](./deployment/environment-variables.md) | Environment variable reference                                 |

## Repository Structure

```
/
├── apps/
│   ├── web/          # Next.js frontend (TypeScript)
│   └── api/          # NestJS backend (TypeScript)
├── packages/
│   ├── ui/           # Shared React component library
│   ├── types/        # Shared TypeScript types and DTOs
│   └── config/       # Shared ESLint, Prettier, and TSConfig
├── docs/             # This documentation
└── docker-compose.yml
```

## Contributing

See [Development / Getting Started](./development/getting-started.md) and [Development / Git Workflow](./development/git-workflow.md) before opening a pull request.
